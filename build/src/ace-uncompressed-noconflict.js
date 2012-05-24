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

var ACE_NAMESPACE = "ace";

var global = (function() {
    return this;
})();

var _define = function(module, deps, payload) {
    if (typeof module !== 'string') {
        if (_define.original)
            _define.original.apply(window, arguments);
        else {
            console.error('dropping module because define wasn\'t a string.');
            console.trace();
        }
        return;
    }

    if (arguments.length == 2)
        payload = deps;

    if (!_define.modules)
        _define.modules = {};

    _define.modules[module] = payload;
};

/**
 * Get at functionality ace.define()ed using the function above
 */
var _require = function(parentId, module, callback) {
    if (Object.prototype.toString.call(module) === "[object Array]") {
        var params = [];
        for (var i = 0, l = module.length; i < l; ++i) {
            var dep = lookup(parentId, module[i]);
            if (!dep && _require.original)
                return _require.original.apply(window, arguments);
            params.push(dep);
        }
        if (callback) {
            callback.apply(null, params);
        }
    }
    else if (typeof module === 'string') {
        var payload = lookup(parentId, module);
        if (!payload && _require.original)
            return _require.original.apply(window, arguments);

        if (callback) {
            callback();
        }

        return payload;
    }
    else {
        if (_require.original)
            return _require.original.apply(window, arguments);
    }
};

var normalizeModule = function(parentId, moduleName) {
    // normalize plugin requires
    if (moduleName.indexOf("!") !== -1) {
        var chunks = moduleName.split("!");
        return normalizeModule(parentId, chunks[0]) + "!" + normalizeModule(parentId, chunks[1]);
    }
    // normalize relative requires
    if (moduleName.charAt(0) == ".") {
        var base = parentId.split("/").slice(0, -1).join("/");
        moduleName = base + "/" + moduleName;

        while(moduleName.indexOf(".") !== -1 && previous != moduleName) {
            var previous = moduleName;
            moduleName = moduleName.replace(/\/\.\//, "/").replace(/[^\/]+\/\.\.\//, "");
        }
    }

    return moduleName;
};

/**
 * Internal function to lookup moduleNames and resolve them by calling the
 * definition function if needed.
 */
var lookup = function(parentId, moduleName) {

    moduleName = normalizeModule(parentId, moduleName);

    var module = _define.modules[moduleName];
    if (!module) {
        return null;
    }

    if (typeof module === 'function') {
        var exports = {};
        var mod = {
            id: moduleName,
            uri: '',
            exports: exports,
            packaged: true
        };

        var req = function(module, callback) {
            return _require(moduleName, module, callback);
        };

        var returnValue = module(req, exports, mod);
        exports = returnValue || mod.exports;

        // cache the resulting module object for next time
        _define.modules[moduleName] = exports;
        return exports;
    }

    return module;
};

function exportAce(ns) {

    if (typeof requirejs !== "undefined") {

        var define = global.define;
        global.define = function(id, deps, callback) {
            if (typeof callback !== "function")
                return define.apply(this, arguments);

            return ace.define(id, deps, function(require, exports, module) {
                if (deps[2] == "module")
                    module.packaged = true;
                return callback.apply(this, arguments);
            });
        };
        global.define.packaged = true;

        return;
    }

    var require = function(module, callback) {
        return _require("", module, callback);
    };
    require.packaged = true;

    var root = global;
    if (ns) {
        if (!global[ns])
            global[ns] = {};
        root = global[ns];
    }

    if (root.define)
        _define.original = root.define;

    root.define = _define;

    if (root.require)
        _require.original = root.require;

    root.require = require;
}

exportAce(ACE_NAMESPACE);

})();/* ***** BEGIN LICENSE BLOCK *****
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

/**
 * class Ace
 *
 * The main class required to set up an Ace instance in the browser.
 *
 *
 **/

ace.define('ace/ace', ['require', 'exports', 'module' , 'ace/lib/fixoldbrowsers', 'ace/lib/dom', 'ace/lib/event', 'ace/editor', 'ace/edit_session', 'ace/undomanager', 'ace/virtual_renderer', 'ace/multi_select', 'ace/worker/worker_client', 'ace/keyboard/hash_handler', 'ace/keyboard/state_handler', 'ace/placeholder', 'ace/config', 'ace/theme/textmate'], function(require, exports, module) {
"use strict";

require("./lib/fixoldbrowsers");

var Dom = require("./lib/dom");
var Event = require("./lib/event");

var Editor = require("./editor").Editor;
var EditSession = require("./edit_session").EditSession;
var UndoManager = require("./undomanager").UndoManager;
var Renderer = require("./virtual_renderer").VirtualRenderer;
var MultiSelect = require("./multi_select").MultiSelect;

// The following require()s are for inclusion in the built ace file
require("./worker/worker_client");
require("./keyboard/hash_handler");
require("./keyboard/state_handler");
require("./placeholder");
require("./config").init();

    /**
     * Ace.edit(el) -> Editor
     * - el (String | DOMElement): Either the id of an element, or the element itself
     *
     * This method embeds the Ace editor into the DOM, at the element provided by `el`.
     *
     **/
exports.edit = function(el) {
    if (typeof(el) == "string") {
        el = document.getElementById(el);
    }

    var doc = new EditSession(Dom.getInnerText(el));
    doc.setUndoManager(new UndoManager());
    el.innerHTML = '';

    var editor = new Editor(new Renderer(el, require("./theme/textmate")));
    new MultiSelect(editor);
    editor.setSession(doc);

    var env = {};
    env.document = doc;
    env.editor = editor;
    editor.resize();
    Event.addListener(window, "resize", function() {
        editor.resize();
    });
    el.env = env;
    // Store env on editor such that it can be accessed later on from
    // the returned object.
    editor.env = env;
    return editor;
};

});
// vim:set ts=4 sts=4 sw=4 st:
// -- kriskowal Kris Kowal Copyright (C) 2009-2010 MIT License
// -- tlrobinson Tom Robinson Copyright (C) 2009-2010 MIT License (Narwhal Project)
// -- dantman Daniel Friesen Copyright(C) 2010 XXX No License Specified
// -- fschaefer Florian Schäfer Copyright (C) 2010 MIT License
// -- Irakli Gozalishvili Copyright (C) 2010 MIT License

/*!
    Copyright (c) 2009, 280 North Inc. http://280north.com/
    MIT License. http://github.com/280north/narwhal/blob/master/README.md
*/

ace.define('ace/lib/fixoldbrowsers', ['require', 'exports', 'module' , 'ace/lib/regexp', 'ace/lib/es5-shim'], function(require, exports, module) {
"use strict";

require("./regexp");
require("./es5-shim");

});
/*
 *  Based on code from:
 *
 * XRegExp 1.5.0
 * (c) 2007-2010 Steven Levithan
 * MIT License
 * <http://xregexp.com>
 * Provides an augmented, extensible, cross-browser implementation of regular expressions,
 * including support for additional syntax, flags, and methods
 */
 
ace.define('ace/lib/regexp', ['require', 'exports', 'module' ], function(require, exports, module) {
"use strict";

    //---------------------------------
    //  Private variables
    //---------------------------------

    var real = {
            exec: RegExp.prototype.exec,
            test: RegExp.prototype.test,
            match: String.prototype.match,
            replace: String.prototype.replace,
            split: String.prototype.split
        },
        compliantExecNpcg = real.exec.call(/()??/, "")[1] === undefined, // check `exec` handling of nonparticipating capturing groups
        compliantLastIndexIncrement = function () {
            var x = /^/g;
            real.test.call(x, "");
            return !x.lastIndex;
        }();

    //---------------------------------
    //  Overriden native methods
    //---------------------------------

    // Adds named capture support (with backreferences returned as `result.name`), and fixes two
    // cross-browser issues per ES3:
    // - Captured values for nonparticipating capturing groups should be returned as `undefined`,
    //   rather than the empty string.
    // - `lastIndex` should not be incremented after zero-length matches.
    RegExp.prototype.exec = function (str) {
        var match = real.exec.apply(this, arguments),
            name, r2;
        if ( typeof(str) == 'string' && match) {
            // Fix browsers whose `exec` methods don't consistently return `undefined` for
            // nonparticipating capturing groups
            if (!compliantExecNpcg && match.length > 1 && indexOf(match, "") > -1) {
                r2 = RegExp(this.source, real.replace.call(getNativeFlags(this), "g", ""));
                // Using `str.slice(match.index)` rather than `match[0]` in case lookahead allowed
                // matching due to characters outside the match
                real.replace.call(str.slice(match.index), r2, function () {
                    for (var i = 1; i < arguments.length - 2; i++) {
                        if (arguments[i] === undefined)
                            match[i] = undefined;
                    }
                });
            }
            // Attach named capture properties
            if (this._xregexp && this._xregexp.captureNames) {
                for (var i = 1; i < match.length; i++) {
                    name = this._xregexp.captureNames[i - 1];
                    if (name)
                       match[name] = match[i];
                }
            }
            // Fix browsers that increment `lastIndex` after zero-length matches
            if (!compliantLastIndexIncrement && this.global && !match[0].length && (this.lastIndex > match.index))
                this.lastIndex--;
        }
        return match;
    };

    // Don't override `test` if it won't change anything
    if (!compliantLastIndexIncrement) {
        // Fix browser bug in native method
        RegExp.prototype.test = function (str) {
            // Use the native `exec` to skip some processing overhead, even though the overriden
            // `exec` would take care of the `lastIndex` fix
            var match = real.exec.call(this, str);
            // Fix browsers that increment `lastIndex` after zero-length matches
            if (match && this.global && !match[0].length && (this.lastIndex > match.index))
                this.lastIndex--;
            return !!match;
        };
    }

    //---------------------------------
    //  Private helper functions
    //---------------------------------

    function getNativeFlags (regex) {
        return (regex.global     ? "g" : "") +
               (regex.ignoreCase ? "i" : "") +
               (regex.multiline  ? "m" : "") +
               (regex.extended   ? "x" : "") + // Proposed for ES4; included in AS3
               (regex.sticky     ? "y" : "");
    };

    function indexOf (array, item, from) {
        if (Array.prototype.indexOf) // Use the native array method if available
            return array.indexOf(item, from);
        for (var i = from || 0; i < array.length; i++) {
            if (array[i] === item)
                return i;
        }
        return -1;
    };

});
// vim: ts=4 sts=4 sw=4 expandtab
// -- kriskowal Kris Kowal Copyright (C) 2009-2011 MIT License
// -- tlrobinson Tom Robinson Copyright (C) 2009-2010 MIT License (Narwhal Project)
// -- dantman Daniel Friesen Copyright (C) 2010 XXX TODO License or CLA
// -- fschaefer Florian Schäfer Copyright (C) 2010 MIT License
// -- Gozala Irakli Gozalishvili Copyright (C) 2010 MIT License
// -- kitcambridge Kit Cambridge Copyright (C) 2011 MIT License
// -- kossnocorp Sasha Koss XXX TODO License or CLA
// -- bryanforbes Bryan Forbes XXX TODO License or CLA
// -- killdream Quildreen Motta Copyright (C) 2011 MIT Licence
// -- michaelficarra Michael Ficarra Copyright (C) 2011 3-clause BSD License
// -- sharkbrainguy Gerard Paapu Copyright (C) 2011 MIT License
// -- bbqsrc Brendan Molloy (C) 2011 Creative Commons Zero (public domain)
// -- iwyg XXX TODO License or CLA
// -- DomenicDenicola Domenic Denicola Copyright (C) 2011 MIT License
// -- xavierm02 Montillet Xavier XXX TODO License or CLA
// -- Raynos Raynos XXX TODO License or CLA
// -- samsonjs Sami Samhuri Copyright (C) 2010 MIT License
// -- rwldrn Rick Waldron Copyright (C) 2011 MIT License
// -- lexer Alexey Zakharov XXX TODO License or CLA

/*!
    Copyright (c) 2009, 280 North Inc. http://280north.com/
    MIT License. http://github.com/280north/narwhal/blob/master/README.md
*/

ace.define('ace/lib/es5-shim', ['require', 'exports', 'module' ], function(require, exports, module) {

/*
 * Brings an environment as close to ECMAScript 5 compliance
 * as is possible with the facilities of erstwhile engines.
 *
 * Annotated ES5: http://es5.github.com/ (specific links below)
 * ES5 Spec: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
 *
 * @module
 */

/*whatsupdoc*/

//
// Function
// ========
//

// ES-5 15.3.4.5
// http://es5.github.com/#x15.3.4.5

if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) { // .length is 1
        // 1. Let Target be the this value.
        var target = this;
        // 2. If IsCallable(Target) is false, throw a TypeError exception.
        if (typeof target != "function")
            throw new TypeError(); // TODO message
        // 3. Let A be a new (possibly empty) internal list of all of the
        //   argument values provided after thisArg (arg1, arg2 etc), in order.
        // XXX slicedArgs will stand in for "A" if used
        var args = slice.call(arguments, 1); // for normal call
        // 4. Let F be a new native ECMAScript object.
        // 11. Set the [[Prototype]] internal property of F to the standard
        //   built-in Function prototype object as specified in 15.3.3.1.
        // 12. Set the [[Call]] internal property of F as described in
        //   15.3.4.5.1.
        // 13. Set the [[Construct]] internal property of F as described in
        //   15.3.4.5.2.
        // 14. Set the [[HasInstance]] internal property of F as described in
        //   15.3.4.5.3.
        var bound = function () {

            if (this instanceof bound) {
                // 15.3.4.5.2 [[Construct]]
                // When the [[Construct]] internal method of a function object,
                // F that was created using the bind function is called with a
                // list of arguments ExtraArgs, the following steps are taken:
                // 1. Let target be the value of F's [[TargetFunction]]
                //   internal property.
                // 2. If target has no [[Construct]] internal method, a
                //   TypeError exception is thrown.
                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Construct]] internal 
                //   method of target providing args as the arguments.

                var F = function(){};
                F.prototype = target.prototype;
                var self = new F;

                var result = target.apply(
                    self,
                    args.concat(slice.call(arguments))
                );
                if (result !== null && Object(result) === result)
                    return result;
                return self;

            } else {
                // 15.3.4.5.1 [[Call]]
                // When the [[Call]] internal method of a function object, F,
                // which was created using the bind function is called with a
                // this value and a list of arguments ExtraArgs, the following
                // steps are taken:
                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 2. Let boundThis be the value of F's [[BoundThis]] internal
                //   property.
                // 3. Let target be the value of F's [[TargetFunction]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the 
                //   list boundArgs in the same order followed by the same 
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Call]] internal method 
                //   of target providing boundThis as the this value and 
                //   providing args as the arguments.

                // equiv: target.call(this, ...boundArgs, ...args)
                return target.apply(
                    that,
                    args.concat(slice.call(arguments))
                );

            }

        };
        // XXX bound.length is never writable, so don't even try
        //
        // 15. If the [[Class]] internal property of Target is "Function", then
        //     a. Let L be the length property of Target minus the length of A.
        //     b. Set the length own property of F to either 0 or L, whichever is 
        //       larger.
        // 16. Else set the length own property of F to 0.
        // 17. Set the attributes of the length own property of F to the values
        //   specified in 15.3.5.1.

        // TODO
        // 18. Set the [[Extensible]] internal property of F to true.
        
        // TODO
        // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
        // 20. Call the [[DefineOwnProperty]] internal method of F with 
        //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
        //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and 
        //   false.
        // 21. Call the [[DefineOwnProperty]] internal method of F with 
        //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower, 
        //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
        //   and false.

        // TODO
        // NOTE Function objects created using Function.prototype.bind do not 
        // have a prototype property or the [[Code]], [[FormalParameters]], and
        // [[Scope]] internal properties.
        // XXX can't delete prototype in pure-js.

        // 22. Return F.
        return bound;
    };
}

// Shortcut to an often accessed properties, in order to avoid multiple
// dereference that costs universally.
// _Please note: Shortcuts are defined after `Function.prototype.bind` as we
// us it in defining shortcuts.
var call = Function.prototype.call;
var prototypeOfArray = Array.prototype;
var prototypeOfObject = Object.prototype;
var slice = prototypeOfArray.slice;
var toString = call.bind(prototypeOfObject.toString);
var owns = call.bind(prototypeOfObject.hasOwnProperty);

// If JS engine supports accessors creating shortcuts.
var defineGetter;
var defineSetter;
var lookupGetter;
var lookupSetter;
var supportsAccessors;
if ((supportsAccessors = owns(prototypeOfObject, "__defineGetter__"))) {
    defineGetter = call.bind(prototypeOfObject.__defineGetter__);
    defineSetter = call.bind(prototypeOfObject.__defineSetter__);
    lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
    lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
}

//
// Array
// =====
//

// ES5 15.4.3.2
// http://es5.github.com/#x15.4.3.2
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
if (!Array.isArray) {
    Array.isArray = function isArray(obj) {
        return toString(obj) == "[object Array]";
    };
}

// The IsCallable() check in the Array functions
// has been replaced with a strict check on the
// internal class of the object to trap cases where
// the provided function was actually a regular
// expression literal, which in V8 and
// JavaScriptCore is a typeof "function".  Only in
// V8 are regular expression literals permitted as
// reduce parameters, so it is desirable in the
// general case for the shim to match the more
// strict and common behavior of rejecting regular
// expressions.

// ES5 15.4.4.18
// http://es5.github.com/#x15.4.4.18
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(fun /*, thisp*/) {
        var self = toObject(this),
            thisp = arguments[1],
            i = 0,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        while (i < length) {
            if (i in self) {
                // Invoke the callback function with call, passing arguments:
                // context, property value, property key, thisArg object context
                fun.call(thisp, self[i], i, self);
            }
            i++;
        }
    };
}

// ES5 15.4.4.19
// http://es5.github.com/#x15.4.4.19
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
if (!Array.prototype.map) {
    Array.prototype.map = function map(fun /*, thisp*/) {
        var self = toObject(this),
            length = self.length >>> 0,
            result = Array(length),
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        for (var i = 0; i < length; i++) {
            if (i in self)
                result[i] = fun.call(thisp, self[i], i, self);
        }
        return result;
    };
}

// ES5 15.4.4.20
// http://es5.github.com/#x15.4.4.20
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
if (!Array.prototype.filter) {
    Array.prototype.filter = function filter(fun /*, thisp */) {
        var self = toObject(this),
            length = self.length >>> 0,
            result = [],
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        for (var i = 0; i < length; i++) {
            if (i in self && fun.call(thisp, self[i], i, self))
                result.push(self[i]);
        }
        return result;
    };
}

// ES5 15.4.4.16
// http://es5.github.com/#x15.4.4.16
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
if (!Array.prototype.every) {
    Array.prototype.every = function every(fun /*, thisp */) {
        var self = toObject(this),
            length = self.length >>> 0,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        for (var i = 0; i < length; i++) {
            if (i in self && !fun.call(thisp, self[i], i, self))
                return false;
        }
        return true;
    };
}

// ES5 15.4.4.17
// http://es5.github.com/#x15.4.4.17
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
if (!Array.prototype.some) {
    Array.prototype.some = function some(fun /*, thisp */) {
        var self = toObject(this),
            length = self.length >>> 0,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        for (var i = 0; i < length; i++) {
            if (i in self && fun.call(thisp, self[i], i, self))
                return true;
        }
        return false;
    };
}

// ES5 15.4.4.21
// http://es5.github.com/#x15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function reduce(fun /*, initial*/) {
        var self = toObject(this),
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        // no value to return if no initial value and an empty array
        if (!length && arguments.length == 1)
            throw new TypeError(); // TODO message

        var i = 0;
        var result;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i++];
                    break;
                }

                // if array contains no values, no initial value to return
                if (++i >= length)
                    throw new TypeError(); // TODO message
            } while (true);
        }

        for (; i < length; i++) {
            if (i in self)
                result = fun.call(void 0, result, self[i], i, self);
        }

        return result;
    };
}

// ES5 15.4.4.22
// http://es5.github.com/#x15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function reduceRight(fun /*, initial*/) {
        var self = toObject(this),
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        // no value to return if no initial value, empty array
        if (!length && arguments.length == 1)
            throw new TypeError(); // TODO message

        var result, i = length - 1;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i--];
                    break;
                }

                // if array contains no values, no initial value to return
                if (--i < 0)
                    throw new TypeError(); // TODO message
            } while (true);
        }

        do {
            if (i in this)
                result = fun.call(void 0, result, self[i], i, self);
        } while (i--);

        return result;
    };
}

// ES5 15.4.4.14
// http://es5.github.com/#x15.4.4.14
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function indexOf(sought /*, fromIndex */ ) {
        var self = toObject(this),
            length = self.length >>> 0;

        if (!length)
            return -1;

        var i = 0;
        if (arguments.length > 1)
            i = toInteger(arguments[1]);

        // handle negative indices
        i = i >= 0 ? i : Math.max(0, length + i);
        for (; i < length; i++) {
            if (i in self && self[i] === sought) {
                return i;
            }
        }
        return -1;
    };
}

// ES5 15.4.4.15
// http://es5.github.com/#x15.4.4.15
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function lastIndexOf(sought /*, fromIndex */) {
        var self = toObject(this),
            length = self.length >>> 0;

        if (!length)
            return -1;
        var i = length - 1;
        if (arguments.length > 1)
            i = Math.min(i, toInteger(arguments[1]));
        // handle negative indices
        i = i >= 0 ? i : length - Math.abs(i);
        for (; i >= 0; i--) {
            if (i in self && sought === self[i])
                return i;
        }
        return -1;
    };
}

//
// Object
// ======
//

// ES5 15.2.3.2
// http://es5.github.com/#x15.2.3.2
if (!Object.getPrototypeOf) {
    // https://github.com/kriskowal/es5-shim/issues#issue/2
    // http://ejohn.org/blog/objectgetprototypeof/
    // recommended by fschaefer on github
    Object.getPrototypeOf = function getPrototypeOf(object) {
        return object.__proto__ || (
            object.constructor ?
            object.constructor.prototype :
            prototypeOfObject
        );
    };
}

// ES5 15.2.3.3
// http://es5.github.com/#x15.2.3.3
if (!Object.getOwnPropertyDescriptor) {
    var ERR_NON_OBJECT = "Object.getOwnPropertyDescriptor called on a " +
                         "non-object: ";
    Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
        if ((typeof object != "object" && typeof object != "function") || object === null)
            throw new TypeError(ERR_NON_OBJECT + object);
        // If object does not owns property return undefined immediately.
        if (!owns(object, property))
            return;

        var descriptor, getter, setter;

        // If object has a property then it's for sure both `enumerable` and
        // `configurable`.
        descriptor =  { enumerable: true, configurable: true };

        // If JS engine supports accessor properties then property may be a
        // getter or setter.
        if (supportsAccessors) {
            // Unfortunately `__lookupGetter__` will return a getter even
            // if object has own non getter property along with a same named
            // inherited getter. To avoid misbehavior we temporary remove
            // `__proto__` so that `__lookupGetter__` will return getter only
            // if it's owned by an object.
            var prototype = object.__proto__;
            object.__proto__ = prototypeOfObject;

            var getter = lookupGetter(object, property);
            var setter = lookupSetter(object, property);

            // Once we have getter and setter we can put values back.
            object.__proto__ = prototype;

            if (getter || setter) {
                if (getter) descriptor.get = getter;
                if (setter) descriptor.set = setter;

                // If it was accessor property we're done and return here
                // in order to avoid adding `value` to the descriptor.
                return descriptor;
            }
        }

        // If we got this far we know that object has an own property that is
        // not an accessor so we set it as a value and return descriptor.
        descriptor.value = object[property];
        return descriptor;
    };
}

// ES5 15.2.3.4
// http://es5.github.com/#x15.2.3.4
if (!Object.getOwnPropertyNames) {
    Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
        return Object.keys(object);
    };
}

// ES5 15.2.3.5
// http://es5.github.com/#x15.2.3.5
if (!Object.create) {
    Object.create = function create(prototype, properties) {
        var object;
        if (prototype === null) {
            object = { "__proto__": null };
        } else {
            if (typeof prototype != "object")
                throw new TypeError("typeof prototype["+(typeof prototype)+"] != 'object'");
            var Type = function () {};
            Type.prototype = prototype;
            object = new Type();
            // IE has no built-in implementation of `Object.getPrototypeOf`
            // neither `__proto__`, but this manually setting `__proto__` will
            // guarantee that `Object.getPrototypeOf` will work as expected with
            // objects created using `Object.create`
            object.__proto__ = prototype;
        }
        if (properties !== void 0)
            Object.defineProperties(object, properties);
        return object;
    };
}

// ES5 15.2.3.6
// http://es5.github.com/#x15.2.3.6

// Patch for WebKit and IE8 standard mode
// Designed by hax <hax.github.com>
// related issue: https://github.com/kriskowal/es5-shim/issues#issue/5
// IE8 Reference:
//     http://msdn.microsoft.com/en-us/library/dd282900.aspx
//     http://msdn.microsoft.com/en-us/library/dd229916.aspx
// WebKit Bugs:
//     https://bugs.webkit.org/show_bug.cgi?id=36423

function doesDefinePropertyWork(object) {
    try {
        Object.defineProperty(object, "sentinel", {});
        return "sentinel" in object;
    } catch (exception) {
        // returns falsy
    }
}

// check whether defineProperty works if it's given. Otherwise,
// shim partially.
if (Object.defineProperty) {
    var definePropertyWorksOnObject = doesDefinePropertyWork({});
    var definePropertyWorksOnDom = typeof document == "undefined" ||
        doesDefinePropertyWork(document.createElement("div"));
    if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
        var definePropertyFallback = Object.defineProperty;
    }
}

if (!Object.defineProperty || definePropertyFallback) {
    var ERR_NON_OBJECT_DESCRIPTOR = "Property description must be an object: ";
    var ERR_NON_OBJECT_TARGET = "Object.defineProperty called on non-object: "
    var ERR_ACCESSORS_NOT_SUPPORTED = "getters & setters can not be defined " +
                                      "on this javascript engine";

    Object.defineProperty = function defineProperty(object, property, descriptor) {
        if ((typeof object != "object" && typeof object != "function") || object === null)
            throw new TypeError(ERR_NON_OBJECT_TARGET + object);
        if ((typeof descriptor != "object" && typeof descriptor != "function") || descriptor === null)
            throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);

        // make a valiant attempt to use the real defineProperty
        // for I8's DOM elements.
        if (definePropertyFallback) {
            try {
                return definePropertyFallback.call(Object, object, property, descriptor);
            } catch (exception) {
                // try the shim if the real one doesn't work
            }
        }

        // If it's a data property.
        if (owns(descriptor, "value")) {
            // fail silently if "writable", "enumerable", or "configurable"
            // are requested but not supported
            /*
            // alternate approach:
            if ( // can't implement these features; allow false but not true
                !(owns(descriptor, "writable") ? descriptor.writable : true) ||
                !(owns(descriptor, "enumerable") ? descriptor.enumerable : true) ||
                !(owns(descriptor, "configurable") ? descriptor.configurable : true)
            )
                throw new RangeError(
                    "This implementation of Object.defineProperty does not " +
                    "support configurable, enumerable, or writable."
                );
            */

            if (supportsAccessors && (lookupGetter(object, property) ||
                                      lookupSetter(object, property)))
            {
                // As accessors are supported only on engines implementing
                // `__proto__` we can safely override `__proto__` while defining
                // a property to make sure that we don't hit an inherited
                // accessor.
                var prototype = object.__proto__;
                object.__proto__ = prototypeOfObject;
                // Deleting a property anyway since getter / setter may be
                // defined on object itself.
                delete object[property];
                object[property] = descriptor.value;
                // Setting original `__proto__` back now.
                object.__proto__ = prototype;
            } else {
                object[property] = descriptor.value;
            }
        } else {
            if (!supportsAccessors)
                throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
            // If we got that far then getters and setters can be defined !!
            if (owns(descriptor, "get"))
                defineGetter(object, property, descriptor.get);
            if (owns(descriptor, "set"))
                defineSetter(object, property, descriptor.set);
        }

        return object;
    };
}

// ES5 15.2.3.7
// http://es5.github.com/#x15.2.3.7
if (!Object.defineProperties) {
    Object.defineProperties = function defineProperties(object, properties) {
        for (var property in properties) {
            if (owns(properties, property))
                Object.defineProperty(object, property, properties[property]);
        }
        return object;
    };
}

// ES5 15.2.3.8
// http://es5.github.com/#x15.2.3.8
if (!Object.seal) {
    Object.seal = function seal(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.9
// http://es5.github.com/#x15.2.3.9
if (!Object.freeze) {
    Object.freeze = function freeze(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// detect a Rhino bug and patch it
try {
    Object.freeze(function () {});
} catch (exception) {
    Object.freeze = (function freeze(freezeObject) {
        return function freeze(object) {
            if (typeof object == "function") {
                return object;
            } else {
                return freezeObject(object);
            }
        };
    })(Object.freeze);
}

// ES5 15.2.3.10
// http://es5.github.com/#x15.2.3.10
if (!Object.preventExtensions) {
    Object.preventExtensions = function preventExtensions(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.11
// http://es5.github.com/#x15.2.3.11
if (!Object.isSealed) {
    Object.isSealed = function isSealed(object) {
        return false;
    };
}

// ES5 15.2.3.12
// http://es5.github.com/#x15.2.3.12
if (!Object.isFrozen) {
    Object.isFrozen = function isFrozen(object) {
        return false;
    };
}

// ES5 15.2.3.13
// http://es5.github.com/#x15.2.3.13
if (!Object.isExtensible) {
    Object.isExtensible = function isExtensible(object) {
        // 1. If Type(O) is not Object throw a TypeError exception.
        if (Object(object) === object) {
            throw new TypeError(); // TODO message
        }
        // 2. Return the Boolean value of the [[Extensible]] internal property of O.
        var name = '';
        while (owns(object, name)) {
            name += '?';
        }
        object[name] = true;
        var returnValue = owns(object, name);
        delete object[name];
        return returnValue;
    };
}

// ES5 15.2.3.14
// http://es5.github.com/#x15.2.3.14
if (!Object.keys) {
    // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
    var hasDontEnumBug = true,
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length;

    for (var key in {"toString": null})
        hasDontEnumBug = false;

    Object.keys = function keys(object) {

        if ((typeof object != "object" && typeof object != "function") || object === null)
            throw new TypeError("Object.keys called on a non-object");

        var keys = [];
        for (var name in object) {
            if (owns(object, name)) {
                keys.push(name);
            }
        }

        if (hasDontEnumBug) {
            for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
                var dontEnum = dontEnums[i];
                if (owns(object, dontEnum)) {
                    keys.push(dontEnum);
                }
            }
        }

        return keys;
    };

}

//
// Date
// ====
//

// ES5 15.9.5.43
// http://es5.github.com/#x15.9.5.43
// This function returns a String value represent the instance in time 
// represented by this Date object. The format of the String is the Date Time 
// string format defined in 15.9.1.15. All fields are present in the String. 
// The time zone is always UTC, denoted by the suffix Z. If the time value of 
// this object is not a finite Number a RangeError exception is thrown.
if (!Date.prototype.toISOString || (new Date(-62198755200000).toISOString().indexOf('-000001') === -1)) {
    Date.prototype.toISOString = function toISOString() {
        var result, length, value, year;
        if (!isFinite(this))
            throw new RangeError;

        // the date time string format is specified in 15.9.1.15.
        result = [this.getUTCMonth() + 1, this.getUTCDate(),
            this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()];
        year = this.getUTCFullYear();
        year = (year < 0 ? '-' : (year > 9999 ? '+' : '')) + ('00000' + Math.abs(year)).slice(0 <= year && year <= 9999 ? -4 : -6);

        length = result.length;
        while (length--) {
            value = result[length];
            // pad months, days, hours, minutes, and seconds to have two digits.
            if (value < 10)
                result[length] = "0" + value;
        }
        // pad milliseconds to have three digits.
        return year + "-" + result.slice(0, 2).join("-") + "T" + result.slice(2).join(":") + "." +
            ("000" + this.getUTCMilliseconds()).slice(-3) + "Z";
    }
}

// ES5 15.9.4.4
// http://es5.github.com/#x15.9.4.4
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}

// ES5 15.9.5.44
// http://es5.github.com/#x15.9.5.44
// This function provides a String representation of a Date object for use by 
// JSON.stringify (15.12.3).
if (!Date.prototype.toJSON) {
    Date.prototype.toJSON = function toJSON(key) {
        // When the toJSON method is called with argument key, the following 
        // steps are taken:

        // 1.  Let O be the result of calling ToObject, giving it the this
        // value as its argument.
        // 2. Let tv be ToPrimitive(O, hint Number).
        // 3. If tv is a Number and is not finite, return null.
        // XXX
        // 4. Let toISO be the result of calling the [[Get]] internal method of
        // O with argument "toISOString".
        // 5. If IsCallable(toISO) is false, throw a TypeError exception.
        if (typeof this.toISOString != "function")
            throw new TypeError(); // TODO message
        // 6. Return the result of calling the [[Call]] internal method of
        //  toISO with O as the this value and an empty argument list.
        return this.toISOString();

        // NOTE 1 The argument is ignored.

        // NOTE 2 The toJSON function is intentionally generic; it does not
        // require that its this value be a Date object. Therefore, it can be
        // transferred to other kinds of objects for use as a method. However,
        // it does require that any such object have a toISOString method. An
        // object is free to use the argument key to filter its
        // stringification.
    };
}

// ES5 15.9.4.2
// http://es5.github.com/#x15.9.4.2
// based on work shared by Daniel Friesen (dantman)
// http://gist.github.com/303249
if (Date.parse("+275760-09-13T00:00:00.000Z") !== 8.64e15) {
    // XXX global assignment won't work in embeddings that use
    // an alternate object for the context.
    Date = (function(NativeDate) {

        // Date.length === 7
        var Date = function Date(Y, M, D, h, m, s, ms) {
            var length = arguments.length;
            if (this instanceof NativeDate) {
                var date = length == 1 && String(Y) === Y ? // isString(Y)
                    // We explicitly pass it through parse:
                    new NativeDate(Date.parse(Y)) :
                    // We have to manually make calls depending on argument
                    // length here
                    length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
                    length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
                    length >= 5 ? new NativeDate(Y, M, D, h, m) :
                    length >= 4 ? new NativeDate(Y, M, D, h) :
                    length >= 3 ? new NativeDate(Y, M, D) :
                    length >= 2 ? new NativeDate(Y, M) :
                    length >= 1 ? new NativeDate(Y) :
                                  new NativeDate();
                // Prevent mixups with unfixed Date object
                date.constructor = Date;
                return date;
            }
            return NativeDate.apply(this, arguments);
        };

        // 15.9.1.15 Date Time String Format.
        var isoDateExpression = new RegExp("^" +
            "(\\d{4}|[\+\-]\\d{6})" + // four-digit year capture or sign + 6-digit extended year
            "(?:-(\\d{2})" + // optional month capture
            "(?:-(\\d{2})" + // optional day capture
            "(?:" + // capture hours:minutes:seconds.milliseconds
                "T(\\d{2})" + // hours capture
                ":(\\d{2})" + // minutes capture
                "(?:" + // optional :seconds.milliseconds
                    ":(\\d{2})" + // seconds capture
                    "(?:\\.(\\d{3}))?" + // milliseconds capture
                ")?" +
            "(?:" + // capture UTC offset component
                "Z|" + // UTC capture
                "(?:" + // offset specifier +/-hours:minutes
                    "([-+])" + // sign capture
                    "(\\d{2})" + // hours offset capture
                    ":(\\d{2})" + // minutes offset capture
                ")" +
            ")?)?)?)?" +
        "$");

        // Copy any custom methods a 3rd party library may have added
        for (var key in NativeDate)
            Date[key] = NativeDate[key];

        // Copy "native" methods explicitly; they may be non-enumerable
        Date.now = NativeDate.now;
        Date.UTC = NativeDate.UTC;
        Date.prototype = NativeDate.prototype;
        Date.prototype.constructor = Date;

        // Upgrade Date.parse to handle simplified ISO 8601 strings
        Date.parse = function parse(string) {
            var match = isoDateExpression.exec(string);
            if (match) {
                match.shift(); // kill match[0], the full match
                // parse months, days, hours, minutes, seconds, and milliseconds
                for (var i = 1; i < 7; i++) {
                    // provide default values if necessary
                    match[i] = +(match[i] || (i < 3 ? 1 : 0));
                    // match[1] is the month. Months are 0-11 in JavaScript
                    // `Date` objects, but 1-12 in ISO notation, so we
                    // decrement.
                    if (i == 1)
                        match[i]--;
                }

                // parse the UTC offset component
                var minuteOffset = +match.pop(), hourOffset = +match.pop(), sign = match.pop();

                // compute the explicit time zone offset if specified
                var offset = 0;
                if (sign) {
                    // detect invalid offsets and return early
                    if (hourOffset > 23 || minuteOffset > 59)
                        return NaN;

                    // express the provided time zone offset in minutes. The offset is
                    // negative for time zones west of UTC; positive otherwise.
                    offset = (hourOffset * 60 + minuteOffset) * 6e4 * (sign == "+" ? -1 : 1);
                }

                // Date.UTC for years between 0 and 99 converts year to 1900 + year
                // The Gregorian calendar has a 400-year cycle, so 
                // to Date.UTC(year + 400, .... ) - 12622780800000 == Date.UTC(year, ...),
                // where 12622780800000 - number of milliseconds in Gregorian calendar 400 years
                var year = +match[0];
                if (0 <= year && year <= 99) {
                    match[0] = year + 400;
                    return NativeDate.UTC.apply(this, match) + offset - 12622780800000;
                }

                // compute a new UTC date value, accounting for the optional offset
                return NativeDate.UTC.apply(this, match) + offset;
            }
            return NativeDate.parse.apply(this, arguments);
        };

        return Date;
    })(Date);
}

//
// String
// ======
//

// ES5 15.5.4.20
// http://es5.github.com/#x15.5.4.20
var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
    "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
    "\u2029\uFEFF";
if (!String.prototype.trim || ws.trim()) {
    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
    // http://perfectionkills.com/whitespace-deviations/
    ws = "[" + ws + "]";
    var trimBeginRegexp = new RegExp("^" + ws + ws + "*"),
        trimEndRegexp = new RegExp(ws + ws + "*$");
    String.prototype.trim = function trim() {
        return String(this).replace(trimBeginRegexp, "").replace(trimEndRegexp, "");
    };
}

//
// Util
// ======
//

// ES5 9.4
// http://es5.github.com/#x9.4
// http://jsperf.com/to-integer
var toInteger = function (n) {
    n = +n;
    if (n !== n) // isNaN
        n = 0;
    else if (n !== 0 && n !== (1/0) && n !== -(1/0))
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    return n;
};

var prepareString = "a"[0] != "a",
    // ES5 9.9
    // http://es5.github.com/#x9.9
    toObject = function (o) {
        if (o == null) { // this matches both null and undefined
            throw new TypeError(); // TODO message
        }
        // If the implementation doesn't support by-index access of
        // string characters (ex. IE < 7), split the string
        if (prepareString && typeof o == "string" && o) {
            return o.split("");
        }
        return Object(o);
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
 *      Mihai Sucan <mihai AT sucan AT gmail ODT com>
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

ace.define('ace/lib/dom', ['require', 'exports', 'module' ], function(require, exports, module) {
"use strict";

var XHTML_NS = "http://www.w3.org/1999/xhtml";

exports.createElement = function(tag, ns) {
    return document.createElementNS ?
           document.createElementNS(ns || XHTML_NS, tag) :
           document.createElement(tag);
};

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

/*
* Add a CSS class to the list of classes on the given node
*/
exports.addCssClass = function(el, name) {
    if (!exports.hasCssClass(el, name)) {
        el.className += " " + name;
    }
};

/*
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

exports.toggleCssClass = function(el, name) {
    var classes = el.className.split(/\s+/g), add = true;
    while (true) {
        var index = classes.indexOf(name);
        if (index == -1) {
            break;
        }
        add = false;
        classes.splice(index, 1);
    }
    if(add)
        classes.push(name);

    el.className = classes.join(" ");
    return add;
};

/*
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

exports.hasCssString = function(id, doc) {
    var index = 0, sheets;
    doc = doc || document;

    if (doc.createStyleSheet && (sheets = doc.styleSheets)) {
        while (index < sheets.length)
            if (sheets[index++].owningElement.id === id) return true;
    } else if ((sheets = doc.getElementsByTagName("style"))) {
        while (index < sheets.length)
            if (sheets[index++].id === id) return true;
    }

    return false;
};

exports.importCssString = function importCssString(cssText, id, doc) {
    doc = doc || document;
    // If style is already imported return immediately.
    if (id && exports.hasCssString(id, doc))
        return null;
    
    var style;
    
    if (doc.createStyleSheet) {
        style = doc.createStyleSheet();
        style.cssText = cssText;
        if (id)
            style.owningElement.id = id;
    } else {
        style = doc.createElementNS
            ? doc.createElementNS(XHTML_NS, "style")
            : doc.createElement("style");

        style.appendChild(doc.createTextNode(cssText));
        if (id)
            style.id = id;

        var head = doc.getElementsByTagName("head")[0] || doc.documentElement;
        head.appendChild(style);
    }
};

exports.importCssStylsheet = function(uri, doc) {
    if (doc.createStyleSheet) {
        doc.createStyleSheet(uri);
    } else {
        var link = exports.createElement('link');
        link.rel = 'stylesheet';
        link.href = uri;

        var head = doc.getElementsByTagName("head")[0] || doc.documentElement;
        head.appendChild(link);
    }
};

exports.getInnerWidth = function(element) {
    return (
        parseInt(exports.computedStyle(element, "paddingLeft"), 10) +
        parseInt(exports.computedStyle(element, "paddingRight"), 10) + 
        element.clientWidth
    );
};

exports.getInnerHeight = function(element) {
    return (
        parseInt(exports.computedStyle(element, "paddingTop"), 10) +
        parseInt(exports.computedStyle(element, "paddingBottom"), 10) +
        element.clientHeight
    );
};

if (window.pageYOffset !== undefined) {
    exports.getPageScrollTop = function() {
        return window.pageYOffset;
    };

    exports.getPageScrollLeft = function() {
        return window.pageXOffset;
    };
}
else {
    exports.getPageScrollTop = function() {
        return document.body.scrollTop;
    };

    exports.getPageScrollLeft = function() {
        return document.body.scrollLeft;
    };
}

if (window.getComputedStyle)
    exports.computedStyle = function(element, style) {
        if (style)
            return (window.getComputedStyle(element, "") || {})[style] || "";
        return window.getComputedStyle(element, "") || {};
    };
else
    exports.computedStyle = function(element, style) {
        if (style)
            return element.currentStyle[style];
        return element.currentStyle;
    };

exports.scrollbarWidth = function(document) {

    var inner = exports.createElement("p");
    inner.style.width = "100%";
    inner.style.minWidth = "0px";
    inner.style.height = "200px";

    var outer = exports.createElement("div");
    var style = outer.style;

    style.position = "absolute";
    style.left = "-10000px";
    style.overflow = "hidden";
    style.width = "200px";
    style.minWidth = "0px";
    style.height = "150px";

    outer.appendChild(inner);

    var body = document.body || document.documentElement;
    body.appendChild(outer);

    var noScrollbar = inner.offsetWidth;

    style.overflow = "scroll";
    var withScrollbar = inner.offsetWidth;

    if (noScrollbar == withScrollbar) {
        withScrollbar = outer.clientWidth;
    }

    body.removeChild(outer);

    return noScrollbar-withScrollbar;
};

/*
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
    var document = el.ownerDocument;
    if (document.body && "textContent" in document.body)
        el.textContent = innerText;
    else
        el.innerText = innerText;

};

exports.getInnerText = function(el) {
    var document = el.ownerDocument;
    if (document.body && "textContent" in document.body)
        return el.textContent;
    else
         return el.innerText || el.textContent || "";
};

exports.getParentWindow = function(document) {
    return document.defaultView || document.parentWindow;
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

ace.define('ace/lib/event', ['require', 'exports', 'module' , 'ace/lib/keys', 'ace/lib/useragent', 'ace/lib/dom'], function(require, exports, module) {
"use strict";

var keys = require("./keys");
var useragent = require("./useragent");
var dom = require("./dom");

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

/*
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

/*
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

        var called = false;
        function onReleaseCapture(e) {
            eventHandler(e);

            if (!called) {
                called = true;
                releaseCaptureHandler(e);
            }

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
            releaseCaptureHandler && releaseCaptureHandler(e);

            document.removeEventListener("mousemove", onMouseMove, true);
            document.removeEventListener("mouseup", onMouseUp, true);

            e.stopPropagation();
        }

        document.addEventListener("mousemove", onMouseMove, true);
        document.addEventListener("mouseup", onMouseUp, true);
    };
}

exports.addMouseWheelListener = function(el, callback) {
    var factor = 8;
    var listener = function(e) {
        if (e.wheelDelta !== undefined) {
            if (e.wheelDeltaX !== undefined) {
                e.wheelX = -e.wheelDeltaX / factor;
                e.wheelY = -e.wheelDeltaY / factor;
            } else {
                e.wheelX = 0;
                e.wheelY = -e.wheelDelta / factor;
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

        var isButton = exports.getButton(e) == button;
        if (!isButton || Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5)
            clicks = 0;

        if (clicks == count) {
            clicks = 0;
            callback(e);
        }

        if (isButton)
            return exports.preventDefault(e);
    };

    exports.addListener(el, "mousedown", listener);
    useragent.isOldIE && exports.addListener(el, "dblclick", listener);
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
                break;
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
    if (!hashId && !(keyCode in keys.FUNCTION_KEYS) && !(keyCode in keys.PRINTABLE_KEYS)) {
        return false;
    }
    return callback(e, hashId, keyCode);
}

exports.addCommandKeyListener = function(el, callback) {
    var addListener = exports.addListener;
    if (useragent.isOldGecko || useragent.isOpera) {
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
    }
};

if (window.postMessage) {
    var postMessageId = 1;
    exports.nextTick = function(callback, win) {
        win = win || window;
        var messageName = "zero-timeout-message-" + postMessageId;            
        exports.addListener(win, "message", function listener(e) {
            if (e.data == messageName) {
                exports.stopPropagation(e);
                exports.removeListener(win, "message", listener);
                callback();
            }
        });
        win.postMessage(messageName, "*");
    };
}
else {
    exports.nextTick = function(callback, win) {
        win = win || window;
        window.setTimeout(callback, 0);
    };
}

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

ace.define('ace/lib/keys', ['require', 'exports', 'module' , 'ace/lib/oop'], function(require, exports, module) {
"use strict";

var oop = require("./oop");

/*
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
            96 : "Numpad0",
            97 : "Numpad1",
            98 : "Numpad2",
            99 : "Numpad3",
            100: "Numpad4",
            101: "Numpad5",
            102: "Numpad6",
            103: "Numpad7",
            104: "Numpad8",
            105: "Numpad9",
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
    for (var i in ret.FUNCTION_KEYS) {
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

exports.keyCodeToString = function(keyCode) {
    return (Keys[keyCode] || String.fromCharCode(keyCode)).toLowerCase();
}

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

ace.define('ace/lib/oop', ['require', 'exports', 'module' ], function(require, exports, module) {
"use strict";

exports.inherits = (function() {
    var tempCtor = function() {};
    return function(ctor, superCtor) {
        tempCtor.prototype = superCtor.prototype;
        ctor.super_ = superCtor.prototype;
        ctor.prototype = new tempCtor();
        ctor.prototype.constructor = ctor;
    };
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

ace.define('ace/lib/useragent', ['require', 'exports', 'module' ], function(require, exports, module) {
"use strict";

var os = (navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase();
var ua = navigator.userAgent;

// Is the user using a browser that identifies itself as Windows
exports.isWin = (os == "win");

// Is the user using a browser that identifies itself as Mac OS
exports.isMac = (os == "mac");

// Is the user using a browser that identifies itself as Linux
exports.isLinux = (os == "linux");

exports.isIE = 
    navigator.appName == "Microsoft Internet Explorer"
    && parseFloat(navigator.userAgent.match(/MSIE ([0-9]+[\.0-9]+)/)[1]);
    
exports.isOldIE = exports.isIE && exports.isIE < 9;

// Is this Firefox or related?
exports.isGecko = exports.isMozilla = window.controllers && window.navigator.product === "Gecko";

// oldGecko == rev < 2.0 
exports.isOldGecko = exports.isGecko && parseInt((navigator.userAgent.match(/rv\:(\d+)/)||[])[1], 10) < 4;

// Is this Opera 
exports.isOpera = window.opera && Object.prototype.toString.call(window.opera) == "[object Opera]";

// Is the user using a browser that identifies itself as WebKit 
exports.isWebKit = parseFloat(ua.split("WebKit/")[1]) || undefined;

exports.isChrome = parseFloat(ua.split(" Chrome/")[1]) || undefined;

exports.isAIR = ua.indexOf("AdobeAIR") >= 0;

exports.isIPad = ua.indexOf("iPad") >= 0;

exports.isTouchPad = ua.indexOf("TouchPad") >= 0;

/*
 * I hate doing this, but we need some way to determine if the user is on a Mac
 * The reason is that users have different expectations of their key combinations.
 *
 * Take copy as an example, Mac people expect to use CMD or APPLE + C
 * Windows folks expect to use CTRL + C
 */
exports.OS = {
    LINUX: "LINUX",
    MAC: "MAC",
    WINDOWS: "WINDOWS"
};

/*
 * Return an exports.OS constant
 */
exports.getOS = function() {
    if (exports.isMac) {
        return exports.OS.MAC;
    } else if (exports.isLinux) {
        return exports.OS.LINUX;
    } else {
        return exports.OS.WINDOWS;
    }
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

ace.define('ace/editor', ['require', 'exports', 'module' , 'ace/lib/fixoldbrowsers', 'ace/lib/oop', 'ace/lib/lang', 'ace/lib/useragent', 'ace/keyboard/textinput', 'ace/mouse/mouse_handler', 'ace/mouse/fold_handler', 'ace/keyboard/keybinding', 'ace/edit_session', 'ace/search', 'ace/range', 'ace/lib/event_emitter', 'ace/commands/command_manager', 'ace/commands/default_commands'], function(require, exports, module) {
"use strict";

require("./lib/fixoldbrowsers");

var oop = require("./lib/oop");
var lang = require("./lib/lang");
var useragent = require("./lib/useragent");
var TextInput = require("./keyboard/textinput").TextInput;
var MouseHandler = require("./mouse/mouse_handler").MouseHandler;
var FoldHandler = require("./mouse/fold_handler").FoldHandler;
//var TouchHandler = require("./touch_handler").TouchHandler;
var KeyBinding = require("./keyboard/keybinding").KeyBinding;
var EditSession = require("./edit_session").EditSession;
var Search = require("./search").Search;
var Range = require("./range").Range;
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var CommandManager = require("./commands/command_manager").CommandManager;
var defaultCommands = require("./commands/default_commands").commands;

/**
 * class Editor
 *
 * The main entry point into the Ace functionality. The `Editor` manages the `EditSession` (which manages `Document`s), as well as the `VirtualRenderer`, which draws everything to the screen. Event sessions dealing with the mouse and keyboard are bubbled up from `Document` to the `Editor`, which decides what to do with them.
 *
 **/

/**
 * new Editor(renderer, session)
 * - renderer (VirtualRenderer): Associated `VirtualRenderer` that draws everything
 * - session (EditSession): The `EditSession` to refer to
 *
 * Creates a new `Editor` object.
 *
 **/
var Editor = function(renderer, session) {
    var container = renderer.getContainerElement();
    this.container = container;
    this.renderer = renderer;

    this.commands = new CommandManager(useragent.isMac ? "mac" : "win", defaultCommands);
    this.textInput  = new TextInput(renderer.getTextAreaContainer(), this);
    this.renderer.textarea = this.textInput.getElement();
    this.keyBinding = new KeyBinding(this);

    // TODO detect touch event support
    if (useragent.isIPad) {
        //this.$mouseHandler = new TouchHandler(this);
    } else {
        this.$mouseHandler = new MouseHandler(this);
        new FoldHandler(this);
    }

    this.$blockScrolling = 0;
    this.$search = new Search().set({
        wrap: true
    });

    this.setSession(session || new EditSession(""));
};

(function(){

    oop.implement(this, EventEmitter);

    /**
     * Editor.setKeyboardHandler(keyboardHandler) 
     * 
     * Sets a new keyboard handler.
     **/
    this.setKeyboardHandler = function(keyboardHandler) {
        this.keyBinding.setKeyboardHandler(keyboardHandler);
    };

    /** related to: KeyBinding
     * Editor.getKeyboardHandler() -> String
     * 
     * Returns the keyboard handler.
     **/
    this.getKeyboardHandler = function() {
        return this.keyBinding.getKeyboardHandler();
    };

    /**
     * Editor.setSession(session) 
     * - session (EditSession): The new session to use
     *
     * Sets a new editsession to use. This method also emits the `'changeSession'` event.
     **/
    this.setSession = function(session) {
        if (this.session == session)
            return;

        if (this.session) {
            var oldSession = this.session;
            this.session.removeEventListener("change", this.$onDocumentChange);
            this.session.removeEventListener("changeMode", this.$onChangeMode);
            this.session.removeEventListener("tokenizerUpdate", this.$onTokenizerUpdate);
            this.session.removeEventListener("changeTabSize", this.$onChangeTabSize);
            this.session.removeEventListener("changeWrapLimit", this.$onChangeWrapLimit);
            this.session.removeEventListener("changeWrapMode", this.$onChangeWrapMode);
            this.session.removeEventListener("onChangeFold", this.$onChangeFold);
            this.session.removeEventListener("changeFrontMarker", this.$onChangeFrontMarker);
            this.session.removeEventListener("changeBackMarker", this.$onChangeBackMarker);
            this.session.removeEventListener("changeBreakpoint", this.$onChangeBreakpoint);
            this.session.removeEventListener("changeAnnotation", this.$onChangeAnnotation);
            this.session.removeEventListener("changeOverwrite", this.$onCursorChange);
            this.session.removeEventListener("changeScrollTop", this.$onScrollTopChange);
            this.session.removeEventListener("changeLeftTop", this.$onScrollLeftChange);

            var selection = this.session.getSelection();
            selection.removeEventListener("changeCursor", this.$onCursorChange);
            selection.removeEventListener("changeSelection", this.$onSelectionChange);
        }

        this.session = session;

        this.$onDocumentChange = this.onDocumentChange.bind(this);
        session.addEventListener("change", this.$onDocumentChange);
        this.renderer.setSession(session);

        this.$onChangeMode = this.onChangeMode.bind(this);
        session.addEventListener("changeMode", this.$onChangeMode);

        this.$onTokenizerUpdate = this.onTokenizerUpdate.bind(this);
        session.addEventListener("tokenizerUpdate", this.$onTokenizerUpdate);

        this.$onChangeTabSize = this.renderer.updateText.bind(this.renderer);
        session.addEventListener("changeTabSize", this.$onChangeTabSize);

        this.$onChangeWrapLimit = this.onChangeWrapLimit.bind(this);
        session.addEventListener("changeWrapLimit", this.$onChangeWrapLimit);

        this.$onChangeWrapMode = this.onChangeWrapMode.bind(this);
        session.addEventListener("changeWrapMode", this.$onChangeWrapMode);

        this.$onChangeFold = this.onChangeFold.bind(this);
        session.addEventListener("changeFold", this.$onChangeFold);

        this.$onChangeFrontMarker = this.onChangeFrontMarker.bind(this);
        this.session.addEventListener("changeFrontMarker", this.$onChangeFrontMarker);

        this.$onChangeBackMarker = this.onChangeBackMarker.bind(this);
        this.session.addEventListener("changeBackMarker", this.$onChangeBackMarker);

        this.$onChangeBreakpoint = this.onChangeBreakpoint.bind(this);
        this.session.addEventListener("changeBreakpoint", this.$onChangeBreakpoint);

        this.$onChangeAnnotation = this.onChangeAnnotation.bind(this);
        this.session.addEventListener("changeAnnotation", this.$onChangeAnnotation);

        this.$onCursorChange = this.onCursorChange.bind(this);
        this.session.addEventListener("changeOverwrite", this.$onCursorChange);

        this.$onScrollTopChange = this.onScrollTopChange.bind(this);
        this.session.addEventListener("changeScrollTop", this.$onScrollTopChange);

        this.$onScrollLeftChange = this.onScrollLeftChange.bind(this);
        this.session.addEventListener("changeScrollLeft", this.$onScrollLeftChange);

        this.selection = session.getSelection();
        this.selection.addEventListener("changeCursor", this.$onCursorChange);

        this.$onSelectionChange = this.onSelectionChange.bind(this);
        this.selection.addEventListener("changeSelection", this.$onSelectionChange);

        this.onChangeMode();

        this.$blockScrolling += 1;
        this.onCursorChange();
        this.$blockScrolling -= 1;

        this.onScrollTopChange();
        this.onScrollLeftChange();
        this.onSelectionChange();
        this.onChangeFrontMarker();
        this.onChangeBackMarker();
        this.onChangeBreakpoint();
        this.onChangeAnnotation();
        this.session.getUseWrapMode() && this.renderer.adjustWrapLimit();
        this.renderer.updateFull();

        this._emit("changeSession", {
            session: session,
            oldSession: oldSession
        });
    };

    /**
     * Editor.getSession() -> EditSession
     * 
     * Returns the current session being used.
     **/
    this.getSession = function() {
        return this.session;
    };

    /**
     * Editor.getSelection() -> String
     * 
     * Returns the currently highlighted selection.
     **/
    this.getSelection = function() {
        return this.selection;
    };

    /** related to: VirtualRenderer.onResize
     * Editor.resize() 
     * 
     * {:VirtualRenderer.onResize}
     **/
    this.resize = function() {
        this.renderer.onResize();
    };

    /**
     * Editor.setTheme(theme) 
     * 
     * {:VirtualRenderer.setTheme}
     **/
    this.setTheme = function(theme) {
        this.renderer.setTheme(theme);
    };

    /** related to: VirtualRenderer.getTheme
     * Editor.getTheme() -> String
     * 
     * {:VirtualRenderer.getTheme}
     **/
    this.getTheme = function() {
        return this.renderer.getTheme();
    };

    /** related to: VirtualRenderer.setStyle
     * Editor.setStyle(style) 
     * 
     * {:VirtualRenderer.setStyle}
     **/
    this.setStyle = function(style) {
        this.renderer.setStyle(style);
    };

    /** related to: VirtualRenderer.unsetStyle
     * Editor.unsetStyle(style) 
     * 
     * {:VirtualRenderer.unsetStyle}
     **/
    this.unsetStyle = function(style) {
        this.renderer.unsetStyle(style);
    };

    /**
     * Editor.setFontSize(size) 
     * - size (Number): A font size 
     * 
     * Set a new font size (in pixels) for the editor text.
     **/
    this.setFontSize = function(size) {
        this.container.style.fontSize = size;
        this.renderer.updateFontSize();
    };

    /** internal, hide
     * Editor.$highlightBrackets() 
     *  
     **/
    this.$highlightBrackets = function() {
        if (this.session.$bracketHighlight) {
            this.session.removeMarker(this.session.$bracketHighlight);
            this.session.$bracketHighlight = null;
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
                self.session.$bracketHighlight = self.session.addMarker(range, "ace_bracket", "text");
            }
        }, 10);
    };

    /**
     * Editor.focus() 
     * 
     * Brings the current `textInput` into focus.
     **/
    this.focus = function() {
        // Safari needs the timeout
        // iOS and Firefox need it called immediately
        // to be on the save side we do both
        var _self = this;
        setTimeout(function() {
            _self.textInput.focus();
        });
        this.textInput.focus();
    };

    /**
     * Editor.isFocused() -> Boolean
     * 
     * Returns true if the current `textInput` is in focus.
     **/
    this.isFocused = function() {
        return this.textInput.isFocused();
    };

    /**
     * Editor.blur() 
     * 
     * Blurs the current `textInput`.
     **/
    this.blur = function() {
        this.textInput.blur();
    };

    /**
     * Editor@onFocus()
     * 
     * Emitted once the editor comes into focus.
     **/
    this.onFocus = function() {
        this.renderer.showCursor();
        this.renderer.visualizeFocus();
        this._emit("focus");
    };

    /**
     * Editor@onBlur()
     * 
     * Emitted once the editor has been blurred.
     **/
    this.onBlur = function() {
        this.renderer.hideCursor();
        this.renderer.visualizeBlur();
        this._emit("blur");
    };

    this.$cursorChange = function() {
        this.renderer.updateCursor();
    };

    /**
     * Editor@onDocumentChange(e) 
     * - e (Object): Contains a single property, `data`, which has the delta of changes
     *
     * Emitted whenever the document is changed. 
     * 
     **/
    this.onDocumentChange = function(e) {
        var delta = e.data;
        var range = delta.range;
        var lastRow;

        if (range.start.row == range.end.row && delta.action != "insertLines" && delta.action != "removeLines")
            lastRow = range.end.row;
        else
            lastRow = Infinity;
        this.renderer.updateLines(range.start.row, lastRow);

        this._emit("change", e);

        // update cursor because tab characters can influence the cursor position
        this.$cursorChange();
    };

    /**
     * Editor@onTokenizerUpdate(e)
     * - e (Object): Contains a single property, `data`, which indicates the changed rows
     * 
     * Emitted when the a tokenizer is updated.
     **/
    this.onTokenizerUpdate = function(e) {
        var rows = e.data;
        this.renderer.updateLines(rows.first, rows.last);
    };

    /**
     * Editor@onScrollTopChange() 
     * 
     * Emitted when the scroll top changes.
     **/
    this.onScrollTopChange = function() {
        this.renderer.scrollToY(this.session.getScrollTop());
    };

    /**
     * Editor@onScrollLeftChange() 
     * 
     * Emitted when the scroll left changes.
     **/
    this.onScrollLeftChange = function() {
        this.renderer.scrollToX(this.session.getScrollLeft());
    };

    /**
     * Editor@onCursorChange() 
     * 
     * Emitted when the cursor changes.
     **/
    this.onCursorChange = function() {
        this.$cursorChange();

        if (!this.$blockScrolling) {
            this.renderer.scrollCursorIntoView();
        }

        this.$highlightBrackets();
        this.$updateHighlightActiveLine();
    };

    /** internal, hide
     * Editor.$updateHighlightActiveLine()
     * 
     * 
     **/
    this.$updateHighlightActiveLine = function() {
        var session = this.getSession();

        if (session.$highlightLineMarker)
            session.removeMarker(session.$highlightLineMarker);

        session.$highlightLineMarker = null;

        if (this.$highlightActiveLine) {
            var cursor = this.getCursorPosition();
            var foldLine = this.session.getFoldLine(cursor.row);

            if ((this.getSelectionStyle() != "line" || !this.selection.isMultiLine())) {
                var range;
                if (foldLine) {
                    range = new Range(foldLine.start.row, 0, foldLine.end.row + 1, 0);
                } else {
                    range = new Range(cursor.row, 0, cursor.row+1, 0);
                }
                session.$highlightLineMarker = session.addMarker(range, "ace_active_line", "background");
            }
        }
    };


    /**
     * Editor@onSelectionChange(e) 
     * - e (Object): Contains a single property, `data`, which has the delta of changes
     * 
     * Emitted when a selection has changed.
     **/
    this.onSelectionChange = function(e) {
        var session = this.getSession();

        if (session.$selectionMarker) {
            session.removeMarker(session.$selectionMarker);
        }
        session.$selectionMarker = null;

        if (!this.selection.isEmpty()) {
            var range = this.selection.getRange();
            var style = this.getSelectionStyle();
            session.$selectionMarker = session.addMarker(range, "ace_selection", style);
        } else {
            this.$updateHighlightActiveLine();
        }

        if (this.$highlightSelectedWord)
            this.session.getMode().highlightSelection(this);
    };

    /**
     * Editor@onChangeFrontMarker() 
     * 
     * Emitted when a front marker changes.
     **/
    this.onChangeFrontMarker = function() {
        this.renderer.updateFrontMarkers();
    };

    /**
     * Editor@onChangeBackMarker() 
     * 
     * Emitted when a back marker changes.
     **/
    this.onChangeBackMarker = function() {
        this.renderer.updateBackMarkers();
    };

    /**
     * Editor@onChangeBreakpoint() 
     * 
     * Emitted when a breakpoint changes.
     **/
    this.onChangeBreakpoint = function() {
        this.renderer.setBreakpoints(this.session.getBreakpoints());
    };

    /**
     * Editor@onChangeAnnotation() 
     * 
     * Emitted when an annotation changes.
     **/
    this.onChangeAnnotation = function() {
        this.renderer.setAnnotations(this.session.getAnnotations());
    };

    /**
     * Editor@onChangeMode() 
     * 
     * Emitted when the mode changes.
     **/
    this.onChangeMode = function() {
        this.renderer.updateText();
    };

    /**
     * Editor@onChangeWrapLimit() 
     * 
     * Emitted when the wrap limit changes.
     **/
    this.onChangeWrapLimit = function() {
        this.renderer.updateFull();
    };

    /**
     * Editor@onChangeWrapMode() 
     * 
     * Emitted when the wrap mode changes.
     **/
    this.onChangeWrapMode = function() {
        this.renderer.onResize(true);
    };

    /**
     * Editor@onChangeFold() 
     * 
     * Emitted when the code folds change.
     **/
    this.onChangeFold = function() {
        // Update the active line marker as due to folding changes the current
        // line range on the screen might have changed.
        this.$updateHighlightActiveLine();
        // TODO: This might be too much updating. Okay for now.
        this.renderer.updateFull();
    };

    /**
     * Editor.getCopyText() -> String
     * 
     * Returns the string of text currently highlighted.
     **/
    this.getCopyText = function() {
        var text = "";
        if (!this.selection.isEmpty())
            text = this.session.getTextRange(this.getSelectionRange());

        this._emit("copy", text);
        return text;
    };

    /**
     * Editor.onCopy() 
     * 
     * Called whenever a text "copy" happens.
     **/
    this.onCopy = function() {
        this.commands.exec("copy", this);
    };

    /**
     * Editor.onCut() 
     * 
     * called whenever a text "cut" happens.
     **/
    this.onCut = function() {
        this.commands.exec("cut", this);
    };

    /**
     * Editor.onPaste() 
     * 
     * called whenever a text "paste" happens.
     **/
    this.onPaste = function(text) {
        this._emit("paste", text);
        this.insert(text);
    };

    /**
     * Editor.insert(text) 
     * - text (String): The new text to add
     * 
     * Inserts `text` into wherever the cursor is pointing.
     **/
    this.insert = function(text) {
        var session = this.session;
        var mode = session.getMode();

        var cursor = this.getCursorPosition();

        if (this.getBehavioursEnabled()) {
            // Get a transform if the current mode wants one.
            var transform = mode.transformAction(session.getState(cursor.row), 'insertion', this, session, text);
            if (transform)
                text = transform.text;
        }

        text = text.replace("\t", this.session.getTabString());

        // remove selected text
        if (!this.selection.isEmpty()) {
            cursor = this.session.remove(this.getSelectionRange());
            this.clearSelection();
        }
        else if (this.session.getOverwrite()) {
            var range = new Range.fromPoints(cursor, cursor);
            range.end.column += text.length;
            this.session.remove(range);
        }

        this.clearSelection();

        var start = cursor.column;
        var lineState = session.getState(cursor.row);
        var shouldOutdent = mode.checkOutdent(lineState, session.getLine(cursor.row), text);
        var line = session.getLine(cursor.row);
        var lineIndent = mode.getNextLineIndent(lineState, line.slice(0, cursor.column), session.getTabString());
        var end = session.insert(cursor, text);

        if (transform && transform.selection) {
            if (transform.selection.length == 2) { // Transform relative to the current column
                this.selection.setSelectionRange(
                    new Range(cursor.row, start + transform.selection[0],
                              cursor.row, start + transform.selection[1]));
            } else { // Transform relative to the current row.
                this.selection.setSelectionRange(
                    new Range(cursor.row + transform.selection[0],
                              transform.selection[1],
                              cursor.row + transform.selection[2],
                              transform.selection[3]));
            }
        }

        var lineState = session.getState(cursor.row);

        // TODO disabled multiline auto indent
        // possibly doing the indent before inserting the text
        // if (cursor.row !== end.row) {
        if (session.getDocument().isNewLine(text)) {
            this.moveCursorTo(cursor.row+1, 0);

            var size = session.getTabSize();
            var minIndent = Number.MAX_VALUE;

            for (var row = cursor.row + 1; row <= end.row; ++row) {
                var indent = 0;

                line = session.getLine(row);
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

                line = session.getLine(row);
                for (var i = 0; i < line.length && outdent > 0; ++i)
                    if (line.charAt(i) == '\t')
                        outdent -= size;
                    else if (line.charAt(i) == ' ')
                        outdent -= 1;
                session.remove(new Range(row, 0, row, i));
            }
            session.indentRows(cursor.row + 1, end.row, lineIndent);
        }
        if (shouldOutdent)
            mode.autoOutdent(lineState, session, cursor.row);
    };

    /**
     * Editor@onTextInput(text, pasted) 
     * - text (String): The text entered
     * - pasted (Boolean): Identifies whether the text was pasted (`true`) or not
     *
     * Emitted when text is entered.
     **/
    this.onTextInput = function(text) {
        this.keyBinding.onTextInput(text);
    };

    /**
     * Editor@onCommandKey(e, hashId, keyCode) 
     * 
     * Emitted when the command-key is pressed.
     **/
    this.onCommandKey = function(e, hashId, keyCode) {
        this.keyBinding.onCommandKey(e, hashId, keyCode);
    };

    /** related to: EditSession.setOverwrite
     * Editor.setOverwrite(overwrite) 
     * - overwrite (Boolean): Defines wheter or not to set overwrites
     * 
     * Pass in `true` to enable overwrites in your session, or `false` to disable. If overwrites is enabled, any text you enter will type over any text after it. If the value of `overwrite` changes, this function also emites the `changeOverwrite` event.
     *
     **/
    this.setOverwrite = function(overwrite) {
        this.session.setOverwrite(overwrite);
    };

    /** related to: EditSession.getOverwrite
     * Editor.getOverwrite() -> Boolean
     * 
     * Returns `true` if overwrites are enabled; `false` otherwise.
     **/
    this.getOverwrite = function() {
        return this.session.getOverwrite();
    };

    /** related to: EditSession.toggleOverwrite
     * Editor.toggleOverwrite() 
     * 
     * Sets the value of overwrite to the opposite of whatever it currently is.
     **/
    this.toggleOverwrite = function() {
        this.session.toggleOverwrite();
    };

    /**
     * Editor.setScrollSpeed(speed) 
     * - speed (Number): A value indicating the new speed
     * 
     * Sets how fast the mouse scrolling should do.
     *
     **/
    this.setScrollSpeed = function(speed) {
        this.$mouseHandler.setScrollSpeed(speed);
    };

    /**
     * Editor.getScrollSpeed() -> Number
     * 
     * Returns the value indicating how fast the mouse scroll speed is.
     **/
    this.getScrollSpeed = function() {
        return this.$mouseHandler.getScrollSpeed();
    };

    /**
     * Editor.setDragDelay(dragDelay) 
     * - dragDelay (Number): A value indicating the new delay
     * 
     * Sets the delay (in milliseconds) of the mouse drag.
     *
     **/
    this.setDragDelay = function(dragDelay) {
        this.$mouseHandler.setDragDelay(dragDelay);
    };

    /**
     * Editor.getDragDelay() -> Number
     * 
     * Returns the current mouse drag delay.
     **/
    this.getDragDelay = function() {
        return this.$mouseHandler.getDragDelay();
    };

    this.$selectionStyle = "line";
    /**
     * Editor.setSelectionStyle(style) 
     * - style (String): The new selection style
     *
     * Indicates how selections should occur. By default, selections are set to "line". This function also emits the `'changeSelectionStyle'` event.
     * 
     **/
    this.setSelectionStyle = function(style) {
        if (this.$selectionStyle == style) return;

        this.$selectionStyle = style;
        this.onSelectionChange();
        this._emit("changeSelectionStyle", {data: style});
    };

    /**
     * Editor.getSelectionStyle() -> String
     * 
     * Returns the current selection style.
     **/
    this.getSelectionStyle = function() {
        return this.$selectionStyle;
    };

    this.$highlightActiveLine = true;

    /**
     * Editor.setHighlightActiveLine(shouldHighlight) 
     * - shouldHighlight (Boolean): Set to `true` to highlight the current line
     *
     * Determines whether or not the current line should be highlighted.
     *
     **/
    this.setHighlightActiveLine = function(shouldHighlight) {
        if (this.$highlightActiveLine == shouldHighlight)
            return;

        this.$highlightActiveLine = shouldHighlight;
        this.$updateHighlightActiveLine();
    };

    /**
     * Editor.getHighlightActiveLine() -> Boolean
     * 
     * Returns `true` if current lines are always highlighted.
     **/
    this.getHighlightActiveLine = function() {
        return this.$highlightActiveLine;
    };

    this.$highlightGutterLine = true;
    this.setHighlightGutterLine = function(shouldHighlight) {
        if (this.$highlightGutterLine == shouldHighlight)
            return;

        this.renderer.setHighlightGutterLine(shouldHighlight);
    };

    this.getHighlightGutterLine = function() {
        return this.$highlightGutterLine;
    };

    this.$highlightSelectedWord = true;
    /**
     * Editor.setHighlightSelectedWord(shouldHighlight) 
     * - shouldHighlight (Boolean): Set to `true` to highlight the currently selected word
     *
     * Determines if the currently selected word should be highlighted.
     **/
    this.setHighlightSelectedWord = function(shouldHighlight) {
        if (this.$highlightSelectedWord == shouldHighlight)
            return;

        this.$highlightSelectedWord = shouldHighlight;
        if (shouldHighlight)
            this.session.getMode().highlightSelection(this);
        else
            this.session.getMode().clearSelectionHighlight(this);
    };

    /**
     * Editor.getHighlightSelectedWord() -> Boolean
     * 
     * Returns `true` if currently highlighted words are to be highlighted.
     **/
    this.getHighlightSelectedWord = function() {
        return this.$highlightSelectedWord;
    };

    this.setAnimatedScroll = function(shouldAnimate){
        this.renderer.setAnimatedScroll(shouldAnimate);
    };

    this.getAnimatedScroll = function(){
        return this.renderer.getAnimatedScroll();
    };

    /**
     * Editor.setShowInvisibles(showInvisibles) 
     * - showInvisibles (Boolean): Specifies whether or not to show invisible characters
     * 
     * If `showInvisibiles` is set to `true`, invisible characters&mdash;like spaces or new lines&mdash;are show in the editor.
     **/
    this.setShowInvisibles = function(showInvisibles) {
        if (this.getShowInvisibles() == showInvisibles)
            return;

        this.renderer.setShowInvisibles(showInvisibles);
    };

    /**
     * Editor.getShowInvisibles() -> Boolean
     * 
     * Returns `true` if invisible characters are being shown.
     **/
    this.getShowInvisibles = function() {
        return this.renderer.getShowInvisibles();
    };

    /**
     * Editor.setShowPrintMargin(showPrintMargin) 
     * - showPrintMargin (Boolean): Specifies whether or not to show the print margin
     * 
     * If `showPrintMargin` is set to `true`, the print margin is shown in the editor.
     **/
    this.setShowPrintMargin = function(showPrintMargin) {
        this.renderer.setShowPrintMargin(showPrintMargin);
    };

    /**
     * Editor.getShowPrintMargin() -> Boolean
     * 
     * Returns `true` if the print margin is being shown.
     **/
    this.getShowPrintMargin = function() {
        return this.renderer.getShowPrintMargin();
    };

    /**
     * Editor.setPrintMarginColumn(showPrintMargin) 
     * - showPrintMargin (Number): Specifies the new print margin
     *
     * Sets the column defining where the print margin should be.
     * 
     **/
    this.setPrintMarginColumn = function(showPrintMargin) {
        this.renderer.setPrintMarginColumn(showPrintMargin);
    };

    /**
     * Editor.getPrintMarginColumn() -> Number
     * 
     * Returns the column number of where the print margin is.
     **/
    this.getPrintMarginColumn = function() {
        return this.renderer.getPrintMarginColumn();
    };

    this.$readOnly = false;
    /**
     * Editor.setReadOnly(readOnly) 
     * - readOnly (Boolean): Specifies whether the editor can be modified or not
     * 
     * If `readOnly` is true, then the editor is set to read-only mode, and none of the content can change.
     **/
    this.setReadOnly = function(readOnly) {
        this.$readOnly = readOnly;
    };

    /**
     * Editor.getReadOnly() -> Boolean
     * 
     * Returns `true` if the editor is set to read-only mode.
     **/
    this.getReadOnly = function() {
        return this.$readOnly;
    };

    this.$modeBehaviours = true;

    /**
     * Editor.setBehavioursEnabled() 
     * - enabled (Boolean): Enables or disables behaviors
     * 
     * Specifies whether to use behaviors or not. ["Behaviors" in this case is the auto-pairing of special characters, like quotation marks, parenthesis, or brackets.]{: #BehaviorsDef}
     **/
    this.setBehavioursEnabled = function (enabled) {
        this.$modeBehaviours = enabled;
    };

    /**
     * Editor.getBehavioursEnabled() -> Boolean
     * 
     * Returns `true` if the behaviors are currently enabled. {:BehaviorsDef}
     **/
    this.getBehavioursEnabled = function () {
        return this.$modeBehaviours;
    };

    /**
     * Editor.setShowFoldWidgets(show) 
     * - show (Boolean): Specifies whether the fold widgets are shown
     * 
     * Indicates whether the fold widgets are shown or not.
     **/
    this.setShowFoldWidgets = function(show) {
        var gutter = this.renderer.$gutterLayer;
        if (gutter.getShowFoldWidgets() == show)
            return;

        this.renderer.$gutterLayer.setShowFoldWidgets(show);
        this.$showFoldWidgets = show;
        this.renderer.updateFull();
    };

    /**
     * Editor.getShowFoldWidgets() -> Boolean
     * 
     * Returns `true` if the fold widgets are shown.
     **/
    this.getShowFoldWidgets = function() {
        return this.renderer.$gutterLayer.getShowFoldWidgets();
    };

    this.setFadeFoldWidgets = function(show) {
        this.renderer.setFadeFoldWidgets(show);
    };

    this.getFadeFoldWidgets = function() {
        return this.renderer.getFadeFoldWidgets();
    };

    /**
     * Editor.remove(dir) 
     * - dir (String): The direction of the deletion to occur, either "left" or "right"
     * 
     * Removes words of text from the editor. A "word" is defined as a string of characters bookended by whitespace.
     *
     **/
    this.remove = function(dir) {
        if (this.selection.isEmpty()){
            if (dir == "left")
                this.selection.selectLeft();
            else
                this.selection.selectRight();
        }

        var range = this.getSelectionRange();
        if (this.getBehavioursEnabled()) {
            var session = this.session;
            var state = session.getState(range.start.row);
            var new_range = session.getMode().transformAction(state, 'deletion', this, session, range);
            if (new_range)
                range = new_range;
        }

        this.session.remove(range);
        this.clearSelection();
    };

    /**
     * Editor.removeWordRight() 
     * 
     * Removes the word directly to the right of the current selection.
     **/
    this.removeWordRight = function() {
        if (this.selection.isEmpty())
            this.selection.selectWordRight();

        this.session.remove(this.getSelectionRange());
        this.clearSelection();
    };

    /**
     * Editor.removeWordLeft() 
     * 
     * Removes the word directly to the left of the current selection.
     **/
    this.removeWordLeft = function() {
        if (this.selection.isEmpty())
            this.selection.selectWordLeft();

        this.session.remove(this.getSelectionRange());
        this.clearSelection();
    };

    /**
     * Editor.removeToLineStart() 
     * 
     * Removes all the words to the left of the current selection, until the start of the line.
     **/
    this.removeToLineStart = function() {
        if (this.selection.isEmpty())
            this.selection.selectLineStart();

        this.session.remove(this.getSelectionRange());
        this.clearSelection();
    };

    /**
     * Editor.removeToLineEnd() 
     * 
     * Removes all the words to the right of the current selection, until the end of the line.
     **/
    this.removeToLineEnd = function() {
        if (this.selection.isEmpty())
            this.selection.selectLineEnd();

        var range = this.getSelectionRange();
        if (range.start.column == range.end.column && range.start.row == range.end.row) {
            range.end.column = 0;
            range.end.row++;
        }

        this.session.remove(range);
        this.clearSelection();
    };

    /**
     * Editor.splitLine() 
     * 
     * Splits the line at the current selection (by inserting an `'\n'`).
     **/
    this.splitLine = function() {
        if (!this.selection.isEmpty()) {
            this.session.remove(this.getSelectionRange());
            this.clearSelection();
        }

        var cursor = this.getCursorPosition();
        this.insert("\n");
        this.moveCursorToPosition(cursor);
    };

    /**
     * Editor.transposeLetters() 
     * 
     * Transposes current line.
     **/
    this.transposeLetters = function() {
        if (!this.selection.isEmpty()) {
            return;
        }

        var cursor = this.getCursorPosition();
        var column = cursor.column;
        if (column === 0)
            return;

        var line = this.session.getLine(cursor.row);
        var swap, range;
        if (column < line.length) {
            swap = line.charAt(column) + line.charAt(column-1);
            range = new Range(cursor.row, column-1, cursor.row, column+1);
        }
        else {
            swap = line.charAt(column-1) + line.charAt(column-2);
            range = new Range(cursor.row, column-2, cursor.row, column);
        }
        this.session.replace(range, swap);
    };

    /**
     * Editor.toLowerCase() 
     * 
     * Converts the current selection entirely into lowercase.
     **/
    this.toLowerCase = function() {
        var originalRange = this.getSelectionRange();
        if (this.selection.isEmpty()) {
            this.selection.selectWord();
        }

        var range = this.getSelectionRange();
        var text = this.session.getTextRange(range);
        this.session.replace(range, text.toLowerCase());
        this.selection.setSelectionRange(originalRange);
    };

    /**
     * Editor.toUpperCase() 
     * 
     * Converts the current selection entirely into uppercase.
     **/
    this.toUpperCase = function() {
        var originalRange = this.getSelectionRange();
        if (this.selection.isEmpty()) {
            this.selection.selectWord();
        }

        var range = this.getSelectionRange();
        var text = this.session.getTextRange(range);
        this.session.replace(range, text.toUpperCase());
        this.selection.setSelectionRange(originalRange);
    };

    /** related to: EditSession.indentRows
     * Editor.indent() 
     * 
     * Indents the current line.
     **/
    this.indent = function() {
        var session = this.session;
        var range = this.getSelectionRange();

        if (range.start.row < range.end.row || range.start.column < range.end.column) {
            var rows = this.$getSelectedRows();
            session.indentRows(rows.first, rows.last, "\t");
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
            return this.insert(indentString);
        }
    };

    /** related to: EditSession.outdentRows
     * Editor.blockOutdent() 
     * 
     * Outdents the current line.
     **/
    this.blockOutdent = function() {
        var selection = this.session.getSelection();
        this.session.outdentRows(selection.getRange());
    };

    /**
     * Editor.toggleCommentLines() 
     * 
     * Given the currently selected range, this function either comments all lines or uncomments all lines (depending on whether it's commented or not).
     **/
    this.toggleCommentLines = function() {
        var state = this.session.getState(this.getCursorPosition().row);
        var rows = this.$getSelectedRows();
        this.session.getMode().toggleCommentLines(state, this.session, rows.first, rows.last);
    };

    /** related to: EditSession.remove
     * Editor.removeLines() 
     * 
     * Removes all the lines in the current selection
     **/
    this.removeLines = function() {
        var rows = this.$getSelectedRows();
        var range;
        if (rows.first === 0 || rows.last+1 < this.session.getLength())
            range = new Range(rows.first, 0, rows.last+1, 0);
        else
            range = new Range(
                rows.first-1, this.session.getLine(rows.first-1).length,
                rows.last, this.session.getLine(rows.last).length
            );
        this.session.remove(range);
        this.clearSelection();
    };

    /** related to: EditSession.moveLinesDown
     * Editor.moveLinesDown() -> Number
     * + (Number): On success, it returns -1.
     *
     * Shifts all the selected lines down one row.
     *
     * 
     *
     **/
    this.moveLinesDown = function() {
        this.$moveLines(function(firstRow, lastRow) {
            return this.session.moveLinesDown(firstRow, lastRow);
        });
    };

    /** related to: EditSession.moveLinesUp
     * Editor.moveLinesUp() -> Number
     * + (Number): On success, it returns -1.
     *
     * Shifts all the selected lines up one row.
     *
     *
     **/
    this.moveLinesUp = function() {
        this.$moveLines(function(firstRow, lastRow) {
            return this.session.moveLinesUp(firstRow, lastRow);
        });
    };

    /** related to: EditSession.moveText
     * Editor.moveText(fromRange, toPosition) -> Range
     * - fromRange (Range): The range of text you want moved within the document
     * - toPosition (Object): The location (row and column) where you want to move the text to
     * + (Range): The new range where the text was moved to.
     *
     * Moves a range of text from the given range to the given position. `toPosition` is an object that looks like this:
     *
     *    { row: newRowLocation, column: newColumnLocation }
     * 
     *
     **/
    this.moveText = function(range, toPosition) {
        if (this.$readOnly)
            return null;

        return this.session.moveText(range, toPosition);
    };

    /** related to: EditSession.duplicateLines
     * Editor.copyLinesUp() -> Number
     * + (Number): On success, returns 0.
     *
     * Copies all the selected lines up one row.
     *
     * 
     **/
    this.copyLinesUp = function() {
        this.$moveLines(function(firstRow, lastRow) {
            this.session.duplicateLines(firstRow, lastRow);
            return 0;
        });
    };

    /** related to: EditSession.duplicateLines
     * Editor.copyLinesDown() -> Number
     * + (Number): On success, returns the number of new rows added; in other words, `lastRow - firstRow + 1`.
     *
     * Copies all the selected lines down one row.
     *
     * 
     *
     **/
    this.copyLinesDown = function() {
        this.$moveLines(function(firstRow, lastRow) {
            return this.session.duplicateLines(firstRow, lastRow);
        });
    };


    /**
     * Editor.$moveLines(mover) 
     * - mover (Function): A method to call on each selected row
     * 
     * Executes a specific function, which can be anything that manipulates selected lines, such as copying them, duplicating them, or shifting them.
     *
     **/
    this.$moveLines = function(mover) {
        var rows = this.$getSelectedRows();
        var selection = this.selection;
        if (!selection.isMultiLine()) {
            var range = selection.getRange();
            var reverse = selection.isBackwards();
        }

        var linesMoved = mover.call(this, rows.first, rows.last);

        if (range) {
            range.start.row += linesMoved;
            range.end.row += linesMoved;
            selection.setSelectionRange(range, reverse);
        }
        else {
            selection.setSelectionAnchor(rows.last+linesMoved+1, 0);
            selection.$moveSelection(function() {
                selection.moveCursorTo(rows.first+linesMoved, 0);
            });
        }
    };

    /**
     * Editor.$getSelectedRows() -> Object
     * 
     * Returns an object indicating the currently selected rows. The object looks like this:
     *
     * { first: range.start.row, last: range.end.row }
     *
     **/
    this.$getSelectedRows = function() {
        var range = this.getSelectionRange().collapseRows();

        return {
            first: range.start.row,
            last: range.end.row
        };
    };

    /** internal, hide
     * Editor@onCompositionStart(text) 
     * - text (String): The text being written
     * 
     * 
     **/
    this.onCompositionStart = function(text) {
        this.renderer.showComposition(this.getCursorPosition());
    };

    /** internal, hide
     * Editor@onCompositionUpdate(text) 
     * - text (String): The text being written
     * 
     * 
     **/
    this.onCompositionUpdate = function(text) {
        this.renderer.setCompositionText(text);
    };

    /** internal, hide
     * Editor@onCompositionEnd() 
     * 
     * 
     **/
    this.onCompositionEnd = function() {
        this.renderer.hideComposition();
    };

    /** related to: VirtualRenderer.getFirstVisibleRow
     * Editor.getFirstVisibleRow() -> Number
     * 
     * {:VirtualRenderer.getFirstVisibleRow}
     **/
    this.getFirstVisibleRow = function() {
        return this.renderer.getFirstVisibleRow();
    };

    /** related to: VirtualRenderer.getLastVisibleRow
     * Editor.getLastVisibleRow() -> Number
     * 
     * {:VirtualRenderer.getLastVisibleRow}
     **/
    this.getLastVisibleRow = function() {
        return this.renderer.getLastVisibleRow();
    };

    /**
     * Editor.isRowVisible(row) -> Boolean
     * - row (Number): The row to check
     * 
     * Indicates if the row is currently visible on the screen.
     **/
    this.isRowVisible = function(row) {
        return (row >= this.getFirstVisibleRow() && row <= this.getLastVisibleRow());
    };

    /**
     * Editor.isRowFullyVisible(row) -> Boolean
     * - row (Number): The row to check
     * 
     * Indicates if the entire row is currently visible on the screen.
     **/
    this.isRowFullyVisible = function(row) {
        return (row >= this.renderer.getFirstFullyVisibleRow() && row <= this.renderer.getLastFullyVisibleRow());
    };

    /**
     * Editor.$getVisibleRowCount() -> Number
     * 
     * Returns the number of currently visibile rows.
     **/
    this.$getVisibleRowCount = function() {
        return this.renderer.getScrollBottomRow() - this.renderer.getScrollTopRow() + 1;
    };

    this.$moveByPage = function(dir, select) {
        var renderer = this.renderer;
        var config = this.renderer.layerConfig;
        var rows = dir * Math.floor(config.height / config.lineHeight);

        this.$blockScrolling++;
        if (select == true) {
            this.selection.$moveSelection(function(){
                this.moveCursorBy(rows, 0);
            });
        } else if (select == false) {
            this.selection.moveCursorBy(rows, 0);
            this.selection.clearSelection();
        }
        this.$blockScrolling--;

        var scrollTop = renderer.scrollTop;

        renderer.scrollBy(0, rows * config.lineHeight);
        if (select != null)
            renderer.scrollCursorIntoView(null, 0.5);

        renderer.animateScrolling(scrollTop);
    };

    /**
     * Editor.selectPageDown() 
     * 
     * Selects the text from the current position of the document until where a "page down" finishes.
     **/
    this.selectPageDown = function() {
        this.$moveByPage(1, true);
    };

    /**
     * Editor.selectPageUp() 
     * 
     * Selects the text from the current position of the document until where a "page up" finishes.
     **/
    this.selectPageUp = function() {
        this.$moveByPage(-1, true);
    };

    /**
     * Editor.gotoPageDown() 
     * 
     * Shifts the document to wherever "page down" is, as well as moving the cursor position.
     **/
    this.gotoPageDown = function() {
       this.$moveByPage(1, false);
    };

    /**
     * Editor.gotoPageUp() 
     * 
     * Shifts the document to wherever "page up" is, as well as moving the cursor position.
     **/
    this.gotoPageUp = function() {
        this.$moveByPage(-1, false);
    };

    /**
     * Editor.scrollPageDown() 
     * 
     * Scrolls the document to wherever "page down" is, without changing the cursor position.
     **/
    this.scrollPageDown = function() {
        this.$moveByPage(1);
    };

    /**
     * Editor.scrollPageUp() 
     * 
     * Scrolls the document to wherever "page up" is, without changing the cursor position.
     **/
    this.scrollPageUp = function() {
        this.$moveByPage(-1);
    };

    /** related to: VirtualRenderer.scrollToRow
     * Editor.scrollToRow(row) 
     * - row (Number): The row to move to
     *
     * Moves the editor to the specified row.
     * 
     **/
    this.scrollToRow = function(row) {
        this.renderer.scrollToRow(row);
    };

    /** related to: VirtualRenderer.scrollToLine
     * Editor.scrollToLine(line, center) 
     * - line (Number): The line to scroll to
     * - center (Boolean): If `true` 
     * - animate (Boolean): If `true` animates scrolling
     * - callback (Function): Function to be called when the animation has finished
     *
     * TODO scrolls a to line, if center == true, puts line in middle of screen or attempts to)
     **/
    this.scrollToLine = function(line, center, animate, callback) {
        this.renderer.scrollToLine(line, center, animate, callback);
    };

    /**
     * Editor.centerSelection() 
     * 
     * Attempts to center the current selection on the screen.
     **/
    this.centerSelection = function() {
        var range = this.getSelectionRange();
        var line = Math.floor(range.start.row + (range.end.row - range.start.row) / 2);
        this.renderer.scrollToLine(line, true);
    };

    /** related to: Selection.getCursor
     * Editor.getCursorPosition() -> Object
     * + (Object): This returns an object that looks something like this:<br/>
     * ```{ row: currRow, column: currCol }```
     *
     * Gets the current position of the cursor.
     *
     *    
     *
     **/
    this.getCursorPosition = function() {
        return this.selection.getCursor();
    };

    /** related to: EditSession.documentToScreenPosition
     * Editor.getCursorPositionScreen() -> Number
     * 
     * Returns the screen position of the cursor.
     **/
    this.getCursorPositionScreen = function() {
        return this.session.documentToScreenPosition(this.getCursorPosition());
    };

    /** related to: Selection.getRange
     * Editor.getSelectionRange() -> Range
     * 
     * {:Selection.getRange}
     **/
    this.getSelectionRange = function() {
        return this.selection.getRange();
    };


    /** related to: Selection.selectAll
     * Editor.selectAll() 
     * 
     * Selects all the text in editor.
     **/
    this.selectAll = function() {
        this.$blockScrolling += 1;
        this.selection.selectAll();
        this.$blockScrolling -= 1;
    };

    /** related to: Selection.clearSelection
     * Editor.clearSelection() 
     * 
     * {:Selection.clearSelection}
     **/
    this.clearSelection = function() {
        this.selection.clearSelection();
    };

    /** related to: Selection.moveCursorTo
     * Editor.moveCursorTo(row, column) 
     * - row (Number): The new row number
     * - column (Number): The new column number
     *
     * Moves the cursor to the specified row and column. Note that this does not de-select the current selection.
     *
     **/
    this.moveCursorTo = function(row, column) {
        this.selection.moveCursorTo(row, column);
    };

    /** related to: Selection.moveCursorToPosition
     * Editor.moveCursorToPosition(pos) 
     * - pos (Object): An object with two properties, row and column
     * 
     * Moves the cursor to the position indicated by `pos.row` and `pos.column`.
     *
     **/
    this.moveCursorToPosition = function(pos) {
        this.selection.moveCursorToPosition(pos);
    };

    /** 
     * Editor.jumpToMatching() 
     * 
     * Moves the cursor's row and column to the next matching bracket.
     *
     **/
    this.jumpToMatching = function() {
        var cursor = this.getCursorPosition();
        var pos = this.session.findMatchingBracket(cursor);
        if (!pos) {
            cursor.column += 1;
            pos = this.session.findMatchingBracket(cursor);
        }
        if (!pos) {
            cursor.column -= 2;
            pos = this.session.findMatchingBracket(cursor);
        }

        if (pos) {
            this.clearSelection();
            this.moveCursorTo(pos.row, pos.column);
        }
    };

    /**
     * Editor.gotoLine(lineNumber, column) 
     * - lineNumber (Number): The line number to go to
     * - column (Number): A column number to go to
     * - animate (Boolean): If `true` animates scolling
     *
     * Moves the cursor to the specified line number, and also into the indiciated column.
     * 
     **/
    this.gotoLine = function(lineNumber, column, animate) {
        this.selection.clearSelection();
        this.session.unfold({row: lineNumber - 1, column: column || 0});

        this.$blockScrolling += 1;
        this.moveCursorTo(lineNumber - 1, column || 0);
        this.$blockScrolling -= 1;

        if (!this.isRowFullyVisible(lineNumber - 1))
            this.scrollToLine(lineNumber - 1, true, animate);
    };

    /** related to: Editor.moveCursorTo
     * Editor.navigateTo(row, column) 
     * - row (Number): The new row number
     * - column (Number): The new column number
     *
     * Moves the cursor to the specified row and column. Note that this does de-select the current selection.
     *
     **/
    this.navigateTo = function(row, column) {
        this.clearSelection();
        this.moveCursorTo(row, column);
    };

    /**
     * Editor.navigateUp(times) 
     * - times (Number): The number of times to change navigation
     * 
     * Moves the cursor up in the document the specified number of times. Note that this does de-select the current selection.
     **/
    this.navigateUp = function(times) {
        this.selection.clearSelection();
        times = times || 1;
        this.selection.moveCursorBy(-times, 0);
    };

    /**
     * Editor.navigateDown(times) 
     * - times (Number): The number of times to change navigation
     * 
     * Moves the cursor down in the document the specified number of times. Note that this does de-select the current selection.
     **/
    this.navigateDown = function(times) {
        this.selection.clearSelection();
        times = times || 1;
        this.selection.moveCursorBy(times, 0);
    };

    /**
     * Editor.navigateLeft(times) 
     * - times (Number): The number of times to change navigation
     * 
     * Moves the cursor left in the document the specified number of times. Note that this does de-select the current selection.
     **/
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

    /**
     * Editor.navigateRight(times) 
     * - times (Number): The number of times to change navigation
     * 
     * Moves the cursor right in the document the specified number of times. Note that this does de-select the current selection.
     **/
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

    /**
     * Editor.navigateLineStart() 
     * 
     * Moves the cursor to the start of the current line. Note that this does de-select the current selection.
     **/
    this.navigateLineStart = function() {
        this.selection.moveCursorLineStart();
        this.clearSelection();
    };

    /**
     * Editor.navigateLineEnd() 
     * 
     * Moves the cursor to the end of the current line. Note that this does de-select the current selection.
     **/
    this.navigateLineEnd = function() {
        this.selection.moveCursorLineEnd();
        this.clearSelection();
    };

    /**
     * Editor.navigateFileEnd() 
     * 
     * Moves the cursor to the end of the current file. Note that this does de-select the current selection.
     **/
    this.navigateFileEnd = function() {
        var scrollTop = this.renderer.scrollTop;
        this.selection.moveCursorFileEnd();
        this.clearSelection();
        this.renderer.animateScrolling(scrollTop);
    };

    /**
     * Editor.navigateFileStart() 
     * 
     * Moves the cursor to the start of the current file. Note that this does de-select the current selection.
     **/
    this.navigateFileStart = function() {
        var scrollTop = this.renderer.scrollTop;
        this.selection.moveCursorFileStart();
        this.clearSelection();
        this.renderer.animateScrolling(scrollTop);
    };

    /**
     * Editor.navigateWordRight() 
     * 
     * Moves the cursor to the word immediately to the right of the current position. Note that this does de-select the current selection.
     **/
    this.navigateWordRight = function() {
        this.selection.moveCursorWordRight();
        this.clearSelection();
    };

    /**
     * Editor.navigateWordLeft() 
     * 
     * Moves the cursor to the word immediately to the left of the current position. Note that this does de-select the current selection.
     **/
    this.navigateWordLeft = function() {
        this.selection.moveCursorWordLeft();
        this.clearSelection();
    };

    /**
     * Editor.replace(replacement, options) 
     * - replacement (String): The text to replace with
     * - options (Object): The [[Search `Search`]] options to use
     *
     * Replaces the first occurance of `options.needle` with the value in `replacement`.
     **/
    this.replace = function(replacement, options) {
        if (options)
            this.$search.set(options);

        var range = this.$search.find(this.session);
        var replaced = 0;
        if (!range)
            return replaced;

        if (this.$tryReplace(range, replacement)) {
            replaced = 1;
        }
        if (range !== null) {
            this.selection.setSelectionRange(range);
            this.renderer.scrollSelectionIntoView(range.start, range.end);
        }

        return replaced;
    };

    /**
     * Editor.replaceAll(replacement, options) 
     * - replacement (String): The text to replace with
     * - options (Object): The [[Search `Search`]] options to use
     *
     * Replaces all occurances of `options.needle` with the value in `replacement`.
     **/
    this.replaceAll = function(replacement, options) {
        if (options) {
            this.$search.set(options);
        }

        var ranges = this.$search.findAll(this.session);
        var replaced = 0;
        if (!ranges.length)
            return replaced;

        this.$blockScrolling += 1;

        var selection = this.getSelectionRange();
        this.clearSelection();
        this.selection.moveCursorTo(0, 0);

        for (var i = ranges.length - 1; i >= 0; --i) {
            if(this.$tryReplace(ranges[i], replacement)) {
                replaced++;
            }
        }

        this.selection.setSelectionRange(selection);
        this.$blockScrolling -= 1;

        return replaced;
    };

    this.$tryReplace = function(range, replacement) {
        var input = this.session.getTextRange(range);
        replacement = this.$search.replace(input, replacement);
        if (replacement !== null) {
            range.end = this.session.replace(range, replacement);
            return range;
        } else {
            return null;
        }
    };

    /** related to: Search.getOptions
     * Editor.getLastSearchOptions() -> Object
     * 
     * {:Search.getOptions} For more information on `options`, see [[Search `Search`]].
     **/
    this.getLastSearchOptions = function() {
        return this.$search.getOptions();
    };

    /** related to: Search.find
     * Editor.find(needle, options) 
     * - needle (String): The text to search for
     * - options (Object): An object defining various search properties
     * - animate (Boolean): If `true` animate scrolling
     *
     * Attempts to find `needle` within the document. For more information on `options`, see [[Search `Search`]].
     **/
    this.find = function(needle, options, animate) {
        this.clearSelection();
        options = options || {};
        options.needle = needle;
        this.$search.set(options);
        this.$find(false, animate);
    };

    /** related to: Editor.find
     * Editor.findNext(options) 
     * - options (Object): search options
     * - animate (Boolean): If `true` animate scrolling
     * 
     * Performs another search for `needle` in the document. For more information on `options`, see [[Search `Search`]].
     **/
    this.findNext = function(options, animate) {
        options = options || {};
        this.$search.set(options);
        this.$find(false, animate);
    };

    /** related to: Editor.find
     * Editor.findPrevious(options) 
     * - options (Object): search options
     * - animate (Boolean): If `true` animate scrolling
     * 
     * Performs a search for `needle` backwards. For more information on `options`, see [[Search `Search`]].
     **/
    this.findPrevious = function(options, animate) {
        options = options || {};
        this.$search.set(options);
        this.$find(true, animate);
    };

    this.$find = function(backwards, animate) {
        if (!this.selection.isEmpty())
            this.$search.set({needle: this.session.getTextRange(this.getSelectionRange())});

        if (typeof backwards != "undefined")
            this.$search.set({backwards: backwards});

        var range = this.$search.find(this.session);
        if (range) {
            this.$blockScrolling += 1;
            this.session.unfold(range);
            this.selection.setSelectionRange(range);
            this.$blockScrolling -= 1;

            var scrollTop = this.renderer.scrollTop;
            this.renderer.scrollSelectionIntoView(range.start, range.end, 0.5);
            this.renderer.animateScrolling(scrollTop);
        }
    };

    /** related to: UndoManager.undo
     * Editor.undo() 
     * 
     * {:UndoManager.undo}
     **/
    this.undo = function() {
        this.$blockScrolling++;
        this.session.getUndoManager().undo();
        this.$blockScrolling--;
        this.renderer.scrollCursorIntoView(null, 0.5);
    };

    /** related to: UndoManager.redo
     * Editor.redo() 
     * 
     * {:UndoManager.redo}
     **/
    this.redo = function() {
        this.$blockScrolling++;
        this.session.getUndoManager().redo();
        this.$blockScrolling--;
        this.renderer.scrollCursorIntoView(null, 0.5);
    };

    /** 
     * Editor.destroy() 
     * 
     * Cleans up the entire editor.
     **/
    this.destroy = function() {
        this.renderer.destroy();
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

ace.define('ace/lib/lang', ['require', 'exports', 'module' ], function(require, exports, module) {
"use strict";

exports.stringReverse = function(string) {
    return string.split("").reverse().join("");
};

exports.stringRepeat = function (string, count) {
     return new Array(count + 1).join(string);
};

var trimBeginRegexp = /^\s\s*/;
var trimEndRegexp = /\s\s*$/;

exports.stringTrimLeft = function (string) {
    return string.replace(trimBeginRegexp, '');
};

exports.stringTrimRight = function (string) {
    return string.replace(trimEndRegexp, '');
};

exports.copyObject = function(obj) {
    var copy = {};
    for (var key in obj) {
        copy[key] = obj[key];
    }
    return copy;
};

exports.copyArray = function(array){
    var copy = [];
    for (var i=0, l=array.length; i<l; i++) {
        if (array[i] && typeof array[i] == "object")
            copy[i] = this.copyObject( array[i] );
        else 
            copy[i] = array[i];
    }
    return copy;
};

exports.deepCopy = function (obj) {
    if (typeof obj != "object") {
        return obj;
    }
    
    var copy = obj.constructor();
    for (var key in obj) {
        if (typeof obj[key] == "object") {
            copy[key] = this.deepCopy(obj[key]);
        } else {
            copy[key] = obj[key];
        }
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

/*
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

    var deferred = function(timeout) {
        deferred.cancel();
        timer = setTimeout(callback, timeout || 0);
        return deferred;
    };

    deferred.schedule = deferred;

    deferred.call = function() {
        this.cancel();
        fcn();
        return deferred;
    };

    deferred.cancel = function() {
        clearTimeout(timer);
        timer = null;
        return deferred;
    };

    return deferred;
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
 *      Mihai Sucan <mihai DOT sucan AT gmail DOT com>
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

ace.define('ace/keyboard/textinput', ['require', 'exports', 'module' , 'ace/lib/event', 'ace/lib/useragent', 'ace/lib/dom'], function(require, exports, module) {
"use strict";

var event = require("../lib/event");
var useragent = require("../lib/useragent");
var dom = require("../lib/dom");

var TextInput = function(parentNode, host) {

    var text = dom.createElement("textarea");
    if (useragent.isTouchPad)
        text.setAttribute("x-palm-disable-auto-cap", true);

    text.setAttribute("wrap", "off");

    text.style.left = "-10000px";
    text.style.position = "fixed";
    parentNode.insertBefore(text, parentNode.firstChild);

    var PLACEHOLDER = String.fromCharCode(0);
    sendText();

    var inCompostion = false;
    var copied = false;
    var pasted = false;
    var tempStyle = '';

    function select() {
        try {
            text.select();
        } catch (e) {}
    }

    function sendText(valueToSend) {
        if (!copied) {
            var value = valueToSend || text.value;
            if (value) {
                if (value.length > 1) {
                    if (value.charAt(0) == PLACEHOLDER)
                        value = value.substr(1);
                    else if (value.charAt(value.length - 1) == PLACEHOLDER)
                        value = value.slice(0, -1);
                }

                if (value && value != PLACEHOLDER) {
                    if (pasted)
                        host.onPaste(value);
                    else
                        host.onTextInput(value);
                }

                // If editor is no longer focused we quit immediately, since
                // it means that something else is in charge now.
                if (!isFocused())
                    return false;
            }
        }

        copied = false;
        pasted = false;

        // Safari doesn't fire copy events if no text is selected
        text.value = PLACEHOLDER;
        select();
    }

    var onTextInput = function(e) {
        setTimeout(function () {
            if (!inCompostion)
                sendText(e.data);
        }, 0);
    };
    
    var onPropertyChange = function(e) {
        if (useragent.isOldIE && text.value.charCodeAt(0) > 128) return;
        setTimeout(function() {
            if (!inCompostion)
                sendText();
        }, 0);
    };

    var onCompositionStart = function(e) {
        inCompostion = true;
        host.onCompositionStart();
        if (!useragent.isGecko) setTimeout(onCompositionUpdate, 0);
    };

    var onCompositionUpdate = function() {
        if (!inCompostion) return;
        host.onCompositionUpdate(text.value);
    };

    var onCompositionEnd = function(e) {
        inCompostion = false;
        host.onCompositionEnd();
    };

    var onCopy = function(e) {
        copied = true;
        var copyText = host.getCopyText();
        if(copyText)
            text.value = copyText;
        else
            e.preventDefault();
        select();
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
        select();
        setTimeout(function () {
            sendText();
        }, 0);
    };

    event.addCommandKeyListener(text, host.onCommandKey.bind(host));

    if (useragent.isOldIE) {
        var keytable = { 13:1, 27:1 };
        event.addListener(text, "keyup", function (e) {
            if (inCompostion && (!text.value || keytable[e.keyCode]))
                setTimeout(onCompositionEnd, 0);
            if ((text.value.charCodeAt(0)|0) < 129) {
                return;
            }
            inCompostion ? onCompositionUpdate() : onCompositionStart();
        });
    }
    
    if ("onpropertychange" in text && !("oninput" in text))
        event.addListener(text, "propertychange", onPropertyChange);
    else
        event.addListener(text, "input", onTextInput);
    
    event.addListener(text, "paste", function(e) {
        // Mark that the next input text comes from past.
        pasted = true;
        // Some browsers support the event.clipboardData API. Use this to get
        // the pasted content which increases speed if pasting a lot of lines.
        if (e.clipboardData && e.clipboardData.getData) {
            sendText(e.clipboardData.getData("text/plain"));
            e.preventDefault();
        } 
        else {
            // If a browser doesn't support any of the things above, use the regular
            // method to detect the pasted input.
            onPropertyChange();
        }
    });

    if ("onbeforecopy" in text && typeof clipboardData !== "undefined") {
        event.addListener(text, "beforecopy", function(e) {
            var copyText = host.getCopyText();
            if (copyText)
                clipboardData.setData("Text", copyText);
            else
                e.preventDefault();
        });
        event.addListener(parentNode, "keydown", function(e) {
            if (e.ctrlKey && e.keyCode == 88) {
                var copyText = host.getCopyText();
                if (copyText) {
                    clipboardData.setData("Text", copyText);
                    host.onCut();
                }
                event.preventDefault(e);
            }
        });
    }
    else {
        event.addListener(text, "copy", onCopy);
        event.addListener(text, "cut", onCut);
    }

    event.addListener(text, "compositionstart", onCompositionStart);
    if (useragent.isGecko) {
        event.addListener(text, "text", onCompositionUpdate);
    }
    if (useragent.isWebKit) {
        event.addListener(text, "keyup", onCompositionUpdate);
    }
    event.addListener(text, "compositionend", onCompositionEnd);

    event.addListener(text, "blur", function() {
        host.onBlur();
    });

    event.addListener(text, "focus", function() {
        host.onFocus();
        select();
    });

    this.focus = function() {
        host.onFocus();
        select();
        text.focus();
    };

    this.blur = function() {
        text.blur();
    };

    function isFocused() {
        return document.activeElement === text;
    }
    this.isFocused = isFocused;

    this.getElement = function() {
        return text;
    };

    this.onContextMenu = function(mousePos, isEmpty){
        if (mousePos) {
            if (!tempStyle)
                tempStyle = text.style.cssText;
                
            text.style.cssText = 
                'position:fixed; z-index:1000;' +
                'left:' + (mousePos.x - 2) + 'px; top:' + (mousePos.y - 2) + 'px;';

        }
        if (isEmpty)
            text.value='';
    };

    this.onContextMenuClose = function(){
        setTimeout(function () {
            if (tempStyle) {
                text.style.cssText = tempStyle;
                tempStyle = '';
            }
            sendText();
        }, 0);
    };
};

exports.TextInput = TextInput;
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
 *      Mihai Sucan <mihai DOT sucan AT gmail DOT com>
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

ace.define('ace/mouse/mouse_handler', ['require', 'exports', 'module' , 'ace/lib/event', 'ace/mouse/default_handlers', 'ace/mouse/default_gutter_handler', 'ace/mouse/mouse_event'], function(require, exports, module) {
"use strict";

var event = require("../lib/event");
var DefaultHandlers = require("./default_handlers").DefaultHandlers;
var DefaultGutterHandler = require("./default_gutter_handler").GutterHandler;
var MouseEvent = require("./mouse_event").MouseEvent;

var MouseHandler = function(editor) {
    this.editor = editor;

    new DefaultHandlers(this);
    new DefaultGutterHandler(this);

    event.addListener(editor.container, "mousedown", function(e) {
        editor.focus();
        return event.preventDefault(e);
    });
    event.addListener(editor.container, "selectstart", function(e) {
        return event.preventDefault(e);
    });

    var mouseTarget = editor.renderer.getMouseEventTarget();
    event.addListener(mouseTarget, "mousedown", this.onMouseEvent.bind(this, "mousedown"));
    event.addListener(mouseTarget, "click", this.onMouseEvent.bind(this, "click"));
    event.addListener(mouseTarget, "mousemove", this.onMouseMove.bind(this, "mousemove"));
    event.addMultiMouseDownListener(mouseTarget, 0, 2, 500, this.onMouseEvent.bind(this, "dblclick"));
    event.addMultiMouseDownListener(mouseTarget, 0, 3, 600, this.onMouseEvent.bind(this, "tripleclick"));
    event.addMultiMouseDownListener(mouseTarget, 0, 4, 600, this.onMouseEvent.bind(this, "quadclick"));
    event.addMouseWheelListener(editor.container, this.onMouseWheel.bind(this, "mousewheel"));

    var gutterEl = editor.renderer.$gutter;
    event.addListener(gutterEl, "mousedown", this.onMouseEvent.bind(this, "guttermousedown"));
    event.addListener(gutterEl, "click", this.onMouseEvent.bind(this, "gutterclick"));
    event.addListener(gutterEl, "dblclick", this.onMouseEvent.bind(this, "gutterdblclick"));
    event.addListener(gutterEl, "mousemove", this.onMouseMove.bind(this, "gutter"));
};

(function() {

    this.$scrollSpeed = 1;
    this.setScrollSpeed = function(speed) {
        this.$scrollSpeed = speed;
    };

    this.getScrollSpeed = function() {
        return this.$scrollSpeed;
    };

    this.onMouseEvent = function(name, e) {
        this.editor._emit(name, new MouseEvent(e, this.editor));
    };

    this.$dragDelay = 250;
    this.setDragDelay = function(dragDelay) {
        this.$dragDelay = dragDelay;
    };

    this.getDragDelay = function() {
        return this.$dragDelay;
    };

    this.onMouseMove = function(name, e) {
        // optimization, because mousemove doesn't have a default handler.
        var listeners = this.editor._eventRegistry && this.editor._eventRegistry.mousemove;
        if (!listeners || !listeners.length)
            return;

        this.editor._emit(name, new MouseEvent(e, this.editor));
    };

    this.onMouseWheel = function(name, e) {
        var mouseEvent = new MouseEvent(e, this.editor);
        mouseEvent.speed = this.$scrollSpeed * 2;
        mouseEvent.wheelX = e.wheelX;
        mouseEvent.wheelY = e.wheelY;

        this.editor._emit(name, mouseEvent);
    };

    this.setState = function(state) {
        this.state = state;
    };

    this.captureMouse = function(ev, state) {
        if (state)
            this.setState(state);

        this.x = ev.x;
        this.y = ev.y;

        // do not move textarea during selection
        var kt = this.editor.renderer.$keepTextAreaAtCursor;
        this.editor.renderer.$keepTextAreaAtCursor = false;

        var self = this;
        var onMouseSelection = function(e) {
            self.x = e.clientX;
            self.y = e.clientY;
        };

        var onMouseSelectionEnd = function(e) {
            clearInterval(timerId);
            self[self.state + "End"] && self[self.state + "End"](e);
            self.$clickSelection = null;
            self.editor.renderer.$keepTextAreaAtCursor = kt;
            self.editor.renderer.$moveTextAreaToCursor();
        };

        var onSelectionInterval = function() {
            self[self.state] && self[self.state]();
        }

        event.capture(this.editor.container, onMouseSelection, onMouseSelectionEnd);
        var timerId = setInterval(onSelectionInterval, 20);

        ev.preventDefault();
    };
}).call(MouseHandler.prototype);

exports.MouseHandler = MouseHandler;
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
 *      Mike de Boer <mike AT ajax DOT org>
 *      Harutyun Amirjanyan <harutyun AT c9 DOT io>
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

ace.define('ace/mouse/default_handlers', ['require', 'exports', 'module' , 'ace/lib/dom', 'ace/lib/browser_focus'], function(require, exports, module) {
"use strict";

var dom = require("../lib/dom");
var BrowserFocus = require("../lib/browser_focus").BrowserFocus;


var DRAG_OFFSET = 5; // pixels



function DefaultHandlers(mouseHandler) {
    mouseHandler.$clickSelection = null;
    mouseHandler.browserFocus = new BrowserFocus();

    var editor = mouseHandler.editor;
    editor.setDefaultHandler("mousedown", this.onMouseDown.bind(mouseHandler));
    editor.setDefaultHandler("dblclick", this.onDoubleClick.bind(mouseHandler));
    editor.setDefaultHandler("tripleclick", this.onTripleClick.bind(mouseHandler));
    editor.setDefaultHandler("quadclick", this.onQuadClick.bind(mouseHandler));
    editor.setDefaultHandler("mousewheel", this.onScroll.bind(mouseHandler));

    var exports = ["select", "startSelect", "drag", "dragEnd", "dragWait",
        "dragWaitEnd", "startDrag"];

    exports.forEach(function(x) {
        mouseHandler[x] = this[x];
    }, this);

    mouseHandler.selectByLines = this.extendSelectionBy.bind(mouseHandler, "getLineRange");
    mouseHandler.selectByWords = this.extendSelectionBy.bind(mouseHandler, "getWordRange");
}

(function() {

    this.onMouseDown = function(ev) {
        this.mousedownEvent = ev;
        var inSelection = ev.inSelection();
        var pos = ev.getDocumentPosition();
        var editor = this.editor;
        var _self = this;

        this.ev = ev
        var selectionRange = editor.getSelectionRange();
        var selectionEmpty = selectionRange.isEmpty();

        var button = ev.getButton();
        if (button !== 0) {
            if (selectionEmpty) {
                editor.moveCursorToPosition(pos);
                editor.selection.clearSelection();
            }
            // 2: contextmenu, 1: linux paste
            this.moveTextarea = function() {
                editor.textInput.onContextMenu({x: _self.x, y: _self.y});
            };
            this.moveTextareaEnd = editor.textInput.onContextMenuClose;
            
            editor.textInput.onContextMenu({x: this.x, y: this.y}, selectionEmpty);
            this.captureMouse(ev, "moveTextarea");

            return;
        }

        // if this click caused the editor to be focused should not clear the
        // selection
        if (inSelection && !editor.isFocused()) {
            editor.focus();
            return;
        }

        if (!inSelection || this.$clickSelection || ev.getShiftKey()) {
            // Directly pick STATE_SELECT, since the user is not clicking inside
            // a selection.
            this.startSelect(pos);
        } else if (inSelection) {
            var e = ev.domEvent;
            if ((e.ctrlKey || e.altKey)) {
                this.startDrag();
            } else {
                this.mousedownEvent.time = (new Date()).getTime();
                this.setState("dragWait");
            }
        }

        this.captureMouse(ev)
    };

    this.startSelect = function(pos) {
        pos = pos || this.editor.renderer.screenToTextCoordinates(this.x, this.y);
        if (this.mousedownEvent.getShiftKey()) {
            this.editor.selection.selectToPosition(pos);
        }
        else if (!this.$clickSelection) {
            this.editor.moveCursorToPosition(pos);
            this.editor.selection.clearSelection();
        }
        this.setState("select");
    }

    this.select = function() {
        var anchor, editor = this.editor;
        var cursor = editor.renderer.screenToTextCoordinates(this.x, this.y);

        if (this.$clickSelection) {
            var cmp = this.$clickSelection.comparePoint(cursor);

            if (cmp == -1) {
                anchor = this.$clickSelection.end;
            } else if (cmp == 1) {
                anchor = this.$clickSelection.start;
            } else {
                cursor = this.$clickSelection.end;
                anchor = this.$clickSelection.start;
            }
            editor.selection.setSelectionAnchor(anchor.row, anchor.column);
        }
        editor.selection.selectToPosition(cursor);

        editor.renderer.scrollCursorIntoView();
    };

    this.extendSelectionBy = function(unitName) {
        var anchor, editor = this.editor;
        var cursor = editor.renderer.screenToTextCoordinates(this.x, this.y);
        var range = editor.selection[unitName](cursor.row, cursor.column);

        if (this.$clickSelection) {
            var cmpStart = this.$clickSelection.comparePoint(range.start);
            var cmpEnd = this.$clickSelection.comparePoint(range.end);

            if (cmpStart == -1 && cmpEnd <= 0) {
                anchor = this.$clickSelection.end;
                cursor = range.start;
            } else if (cmpEnd == 1 && cmpStart >= 0) {
                anchor = this.$clickSelection.start;
                cursor = range.end;
            } else if (cmpStart == -1 && cmpEnd == 1) {
                cursor = range.end;
                anchor = range.start;
            } else {
                cursor = this.$clickSelection.end;
                anchor = this.$clickSelection.start;
            }
            editor.selection.setSelectionAnchor(anchor.row, anchor.column);
        }
        editor.selection.selectToPosition(cursor);

        editor.renderer.scrollCursorIntoView();
    };

    this.startDrag = function() {
        var editor = this.editor;
        this.setState("drag");
        this.dragRange = editor.getSelectionRange();
        var style = editor.getSelectionStyle();
        this.dragSelectionMarker = editor.session.addMarker(this.dragRange, "ace_selection", style);
        editor.clearSelection();
        dom.addCssClass(editor.container, "ace_dragging");
        if (!this.$dragKeybinding) {
            this.$dragKeybinding = {
                handleKeyboard: function(data, hashId, keyString, keyCode) {
                    if (keyString == "esc")
                        return {command: this.command};
                },
                command: {
                    exec: function(editor) {
                        var self = editor.$mouseHandler;
                        self.dragCursor = null
                        self.dragEnd();
                        self.startSelect();
                    }
                }
            }
        }

        editor.keyBinding.addKeyboardHandler(this.$dragKeybinding);
    };

    this.dragWait = function() {
        var distance = calcDistance(this.mousedownEvent.x, this.mousedownEvent.y, this.x, this.y);
        var time = (new Date()).getTime();
        var editor = this.editor;

        if (distance > DRAG_OFFSET) {
            this.startSelect();
        } else if ((time - this.mousedownEvent.time) > editor.getDragDelay()) {
            this.startDrag()
        }
    };

    this.dragWaitEnd = function(e) {
        this.mousedownEvent.domEvent = e;
        this.startSelect();
    };

    this.drag = function() {
        var editor = this.editor;
        this.dragCursor = editor.renderer.screenToTextCoordinates(this.x, this.y);
        editor.moveCursorToPosition(this.dragCursor);
        editor.renderer.scrollCursorIntoView();
    };

    this.dragEnd = function(e) {
        var editor = this.editor;
        var dragCursor = this.dragCursor;
        var dragRange = this.dragRange;
        dom.removeCssClass(editor.container, "ace_dragging");
        editor.session.removeMarker(this.dragSelectionMarker);
        editor.keyBinding.removeKeyboardHandler(this.$dragKeybinding);

        if (!dragCursor)
            return;

        editor.clearSelection();
        if (e && (e.ctrlKey || e.altKey)) {
            var session = editor.session;
            var newRange = dragRange;
            newRange.end = session.insert(dragCursor, session.getTextRange(dragRange));
            newRange.start = dragCursor;
        } else if (dragRange.contains(dragCursor.row, dragCursor.column)) {
            return;
        } else {
            var newRange = editor.moveText(dragRange, dragCursor);
        }

        if (!newRange)
            return;

        editor.selection.setSelectionRange(newRange);
    };

    this.onDoubleClick = function(ev) {
        var pos = ev.getDocumentPosition();
        var editor = this.editor;

        this.setState("selectByWords");

        editor.moveCursorToPosition(pos);
        editor.selection.selectWord();
        this.$clickSelection = editor.getSelectionRange();
    };

    this.onTripleClick = function(ev) {
        var pos = ev.getDocumentPosition();
        var editor = this.editor;

        this.setState("selectByLines");

        editor.moveCursorToPosition(pos);
        editor.selection.selectLine();
        this.$clickSelection = editor.getSelectionRange();
    };

    this.onQuadClick = function(ev) {
        var editor = this.editor;

        editor.selectAll();
        this.$clickSelection = editor.getSelectionRange();
        this.setState("select");
    };

    this.onScroll = function(ev) {
        var editor = this.editor;
        var isScrolable = editor.renderer.isScrollableBy(ev.wheelX * ev.speed, ev.wheelY * ev.speed);
        if (isScrolable) {
            this.$passScrollEvent = false;
        } else {
            if (this.$passScrollEvent)
                return;

            if (!this.$scrollStopTimeout) {
                var self = this;
                this.$scrollStopTimeout = setTimeout(function() {
                    self.$passScrollEvent = true;
                    self.$scrollStopTimeout = null;
                }, 200);
            }
        }

        editor.renderer.scrollBy(ev.wheelX * ev.speed, ev.wheelY * ev.speed);
        return ev.preventDefault();
    };

}).call(DefaultHandlers.prototype);

exports.DefaultHandlers = DefaultHandlers;

function calcDistance(ax, ay, bx, by) {
    return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
}

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

ace.define('ace/lib/browser_focus', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/lib/event', 'ace/lib/event_emitter'], function(require, exports, module) {
"use strict";

var oop = require("./oop");
var event = require("./event");
var EventEmitter = require("./event_emitter").EventEmitter;

/*
 * This class keeps track of the focus state of the given window.
 * Focus changes for example when the user switches a browser tab,
 * goes to the location bar or switches to another application.
 */ 
var BrowserFocus = function(win) {
    win = win || window;
    
    this.lastFocus = new Date().getTime();
    this._isFocused = true;
    
    var _self = this;

    // IE < 9 supports focusin and focusout events
    if ("onfocusin" in win.document) {
        event.addListener(win.document, "focusin", function(e) {
            _self._setFocused(true);
        });

        event.addListener(win.document, "focusout", function(e) {
            _self._setFocused(!!e.toElement);
        });
    }
    else {
        event.addListener(win, "blur", function(e) {
            _self._setFocused(false);
        });

        event.addListener(win, "focus", function(e) {
            _self._setFocused(true);
        });
    }
};

(function(){

    oop.implement(this, EventEmitter);
    
    this.isFocused = function() {
        return this._isFocused;
    };
    
    this._setFocused = function(isFocused) {
        if (this._isFocused == isFocused)
            return;
            
        if (isFocused)
            this.lastFocus = new Date().getTime();
            
        this._isFocused = isFocused;
        this._emit("changeFocus");
    };

}).call(BrowserFocus.prototype);


exports.BrowserFocus = BrowserFocus;
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
 *      Mike de Boer <mike AT ajax DOT org>
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

ace.define('ace/lib/event_emitter', ['require', 'exports', 'module' ], function(require, exports, module) {
"use strict";

var EventEmitter = {};

EventEmitter._emit =
EventEmitter._dispatchEvent = function(eventName, e) {
    this._eventRegistry = this._eventRegistry || {};
    this._defaultHandlers = this._defaultHandlers || {};

    var listeners = this._eventRegistry[eventName] || [];
    var defaultHandler = this._defaultHandlers[eventName];
    if (!listeners.length && !defaultHandler)
        return;

    e = e || {};
    e.type = eventName;
    
    if (!e.stopPropagation) {
        e.stopPropagation = function() {
            this.propagationStopped = true;
        };
    }
    
    if (!e.preventDefault) {
        e.preventDefault = function() {
            this.defaultPrevented = true;
        };
    }

    for (var i=0; i<listeners.length; i++) {
        listeners[i](e);
        if (e.propagationStopped)
            break;
    }
    
    if (defaultHandler && !e.defaultPrevented)
        return defaultHandler(e);
};

EventEmitter.setDefaultHandler = function(eventName, callback) {
    this._defaultHandlers = this._defaultHandlers || {};
    
    if (this._defaultHandlers[eventName])
        throw new Error("The default handler for '" + eventName + "' is already set");
        
    this._defaultHandlers[eventName] = callback;
};

EventEmitter.on =
EventEmitter.addEventListener = function(eventName, callback) {
    this._eventRegistry = this._eventRegistry || {};

    var listeners = this._eventRegistry[eventName];
    if (!listeners)
        var listeners = this._eventRegistry[eventName] = [];

    if (listeners.indexOf(callback) == -1)
        listeners.push(callback);
};

EventEmitter.removeListener =
EventEmitter.removeEventListener = function(eventName, callback) {
    this._eventRegistry = this._eventRegistry || {};

    var listeners = this._eventRegistry[eventName];
    if (!listeners)
        return;

    var index = listeners.indexOf(callback);
    if (index !== -1)
        listeners.splice(index, 1);
};

EventEmitter.removeAllListeners = function(eventName) {
    if (this._eventRegistry) this._eventRegistry[eventName] = [];
};

exports.EventEmitter = EventEmitter;

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

ace.define('ace/mouse/default_gutter_handler', ['require', 'exports', 'module' ], function(require, exports, module) {
"use strict";

function GutterHandler(mouseHandler) {
    var editor = mouseHandler.editor;

    mouseHandler.editor.setDefaultHandler("guttermousedown", function(e) {
        if (e.domEvent.target.className.indexOf("ace_gutter-cell") == -1)
            return;

        if (!editor.isFocused())
            return;

        var row = e.getDocumentPosition().row;
        var selection = editor.session.selection;

        selection.moveCursorTo(row, 0);
        selection.selectLine();

        mouseHandler.$clickSelection = selection.getRange();
        mouseHandler.captureMouse(e, "selectByLines");
    });
}

exports.GutterHandler = GutterHandler;

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

ace.define('ace/mouse/mouse_event', ['require', 'exports', 'module' , 'ace/lib/event'], function(require, exports, module) {
"use strict";

var event = require("../lib/event");

/*
 * Custom Ace mouse event
 */
var MouseEvent = exports.MouseEvent = function(domEvent, editor) {
    this.domEvent = domEvent;
    this.editor = editor;
    
    this.x = this.clientX = domEvent.clientX;
    this.y = this.clientY = domEvent.clientY;

    this.$pos = null;
    this.$inSelection = null;
    
    this.propagationStopped = false;
    this.defaultPrevented = false;
};

(function() {  
    
    this.stopPropagation = function() {
        event.stopPropagation(this.domEvent);
        this.propagationStopped = true;
    };
    
    this.preventDefault = function() {
        event.preventDefault(this.domEvent);
        this.defaultPrevented = true;
    };
    
    this.stop = function() {
        this.stopPropagation();
        this.preventDefault();
    };

    /*
     * Get the document position below the mouse cursor
     * 
     * @return {Object} 'row' and 'column' of the document position
     */
    this.getDocumentPosition = function() {
        if (this.$pos)
            return this.$pos;
        
        this.$pos = this.editor.renderer.screenToTextCoordinates(this.clientX, this.clientY);
        return this.$pos;
    };
    
    /*
     * Check if the mouse cursor is inside of the text selection
     * 
     * @return {Boolean} whether the mouse cursor is inside of the selection
     */
    this.inSelection = function() {
        if (this.$inSelection !== null)
            return this.$inSelection;
            
        var editor = this.editor;
        
        if (editor.getReadOnly()) {
            this.$inSelection = false;
        }
        else {
            var selectionRange = editor.getSelectionRange();
            if (selectionRange.isEmpty())
                this.$inSelection = false;
            else {
                var pos = this.getDocumentPosition();
                this.$inSelection = selectionRange.contains(pos.row, pos.column);
            }
        }
        return this.$inSelection;
    };
    
    /*
     * Get the clicked mouse button
     * 
     * @return {Number} 0 for left button, 1 for middle button, 2 for right button
     */
    this.getButton = function() {
        return event.getButton(this.domEvent);
    };
    
    /*
     * @return {Boolean} whether the shift key was pressed when the event was emitted
     */
    this.getShiftKey = function() {
        return this.domEvent.shiftKey;
    };
    
    this.getAccelKey = function() {
        return this.domEvent.ctrlKey || this.domEvent.metaKey ;
    };
    
}).call(MouseEvent.prototype);

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

ace.define('ace/mouse/fold_handler', ['require', 'exports', 'module' ], function(require, exports, module) {
"use strict";

function FoldHandler(editor) {
    
    editor.on("click", function(e) {
        var position = e.getDocumentPosition();
        var session = editor.session;
        
        // If the user clicked on a fold, then expand it.
        var fold = session.getFoldAt(position.row, position.column, 1);
        if (fold) {
            if (e.getAccelKey())
                session.removeFold(fold);
            else
                session.expandFold(fold);
                
            e.stop();
        }
    });
    
    editor.on("gutterclick", function(e) {
        if (e.domEvent.target.className.indexOf("ace_fold-widget") != -1) {
            var row = e.getDocumentPosition().row;
            editor.session.onFoldWidgetClick(row, e.domEvent);
            e.stop();
        }
    });
}

exports.FoldHandler = FoldHandler;

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
 *      Harutyun Amirjanyan <amirjanyan@gmail.com>
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

ace.define('ace/keyboard/keybinding', ['require', 'exports', 'module' , 'ace/lib/keys', 'ace/lib/event', 'ace/commands/default_commands'], function(require, exports, module) {
"use strict";

var keyUtil  = require("../lib/keys");
var event = require("../lib/event");
require("../commands/default_commands");

var KeyBinding = function(editor) {
    this.$editor = editor;
    this.$data = { };
    this.$handlers = [];
    this.setDefaultHandler(editor.commands);
};

(function() {
    this.setDefaultHandler = function(keyboardHandler) {
        this.removeKeyboardHandler(this.$defaultHandler);
        this.$defaultHandler = keyboardHandler;
        if (keyboardHandler)
            this.$handlers.unshift(keyboardHandler);
        this.$data = { };
    };

    this.setKeyboardHandler = function(keyboardHandler) {
        if (this.$handlers[this.$handlers.length - 1] == keyboardHandler)
            return;
        this.$data = { };
        this.$handlers = [];
        this.setDefaultHandler(this.$defaultHandler);
        if (keyboardHandler)
            this.$handlers.push(keyboardHandler);
    };

    this.addKeyboardHandler = function(keyboardHandler) {
        this.removeKeyboardHandler(keyboardHandler);
        this.$handlers.push(keyboardHandler);
    };

    this.removeKeyboardHandler = function(keyboardHandler) {
        var i = this.$handlers.indexOf(keyboardHandler);
        if (i == -1)
            return false;
        this.$handlers.splice(i, 1);
        return true;
    };

    this.getKeyboardHandler = function() {
        return this.$handlers[this.$handlers.length - 1];
    };

    this.$callKeyboardHandlers = function (hashId, keyString, keyCode, e) {
        var toExecute;
        for (var i = this.$handlers.length; i--;) {
            toExecute = this.$handlers[i].handleKeyboard(
                this.$data, hashId, keyString, keyCode, e
            );
            if (toExecute && toExecute.command)
                break;
        }

        if (!toExecute || !toExecute.command)
            return false;

        var success = false;
        var commands = this.$editor.commands;

        // allow keyboardHandler to consume keys
        if (toExecute.command != "null")
            success = commands.exec(toExecute.command, this.$editor, toExecute.args, e);
        else
            success = true;

        if (success && e)
            event.stopEvent(e);

        return success;
    };

    this.onCommandKey = function(e, hashId, keyCode) {
        var keyString = keyUtil.keyCodeToString(keyCode);
        this.$callKeyboardHandlers(hashId, keyString, keyCode, e);
    };

    this.onTextInput = function(text) {
        var success = false;
        if (text.length == 1)
            success = this.$callKeyboardHandlers(0, text);
        if (!success)
            this.$editor.commands.exec("insertstring", this.$editor, text);
    };

}).call(KeyBinding.prototype);

exports.KeyBinding = KeyBinding;
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
 *      Julian Viereck <julian.viereck@gmail.com>
 *      Mihai Sucan <mihai.sucan@gmail.com>
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

ace.define('ace/commands/default_commands', ['require', 'exports', 'module' , 'ace/lib/lang'], function(require, exports, module) {
"use strict";

var lang = require("../lib/lang");

function bindKey(win, mac) {
    return {
        win: win,
        mac: mac
    };
}

exports.commands = [{
    name: "selectall",
    bindKey: bindKey("Ctrl-A", "Command-A"),
    exec: function(editor) { editor.selectAll(); },
    readOnly: true
}, {
    name: "centerselection",
    bindKey: bindKey(null, "Ctrl-L"),
    exec: function(editor) { editor.centerSelection(); },
    readOnly: true
}, {
    name: "gotoline",
    bindKey: bindKey("Ctrl-L", "Command-L"),
    exec: function(editor) {
        var line = parseInt(prompt("Enter line number:"), 10);
        if (!isNaN(line)) {
            editor.gotoLine(line);
        }
    },
    readOnly: true
}, {
    name: "fold",
    bindKey: bindKey("Alt-L", "Alt-L"),
    exec: function(editor) { editor.session.toggleFold(false); },
    readOnly: true
}, {
    name: "unfold",
    bindKey: bindKey("Alt-Shift-L", "Alt-Shift-L"),
    exec: function(editor) { editor.session.toggleFold(true); },
    readOnly: true
}, {
    name: "foldall",
    bindKey: bindKey("Alt-0", "Alt-0"),
    exec: function(editor) { editor.session.foldAll(); },
    readOnly: true
}, {
    name: "unfoldall",
    bindKey: bindKey("Alt-Shift-0", "Alt-Shift-0"),
    exec: function(editor) { editor.session.unfold(); },
    readOnly: true
}, {
    name: "findnext",
    bindKey: bindKey("Ctrl-K", "Command-G"),
    exec: function(editor) { editor.findNext(); },
    readOnly: true
}, {
    name: "findprevious",
    bindKey: bindKey("Ctrl-Shift-K", "Command-Shift-G"),
    exec: function(editor) { editor.findPrevious(); },
    readOnly: true
}, {
    name: "find",
    bindKey: bindKey("Ctrl-F", "Command-F"),
    exec: function(editor) {
        var needle = prompt("Find:", editor.getCopyText());
        editor.find(needle);
    },
    readOnly: true
}, {
    name: "overwrite",
    bindKey: bindKey("Insert", "Insert"),
    exec: function(editor) { editor.toggleOverwrite(); },
    readOnly: true
}, {
    name: "selecttostart",
    bindKey: bindKey("Ctrl-Shift-Home|Alt-Shift-Up", "Command-Shift-Up"),
    exec: function(editor) { editor.getSelection().selectFileStart(); },
    readOnly: true
}, {
    name: "gotostart",
    bindKey: bindKey("Ctrl-Home|Ctrl-Up", "Command-Home|Command-Up"),
    exec: function(editor) { editor.navigateFileStart(); },
    readOnly: true
}, {
    name: "selectup",
    bindKey: bindKey("Shift-Up", "Shift-Up"),
    exec: function(editor) { editor.getSelection().selectUp(); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "golineup",
    bindKey: bindKey("Up", "Up|Ctrl-P"),
    exec: function(editor, args) { editor.navigateUp(args.times); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "selecttoend",
    bindKey: bindKey("Ctrl-Shift-End|Alt-Shift-Down", "Command-Shift-Down"),
    exec: function(editor) { editor.getSelection().selectFileEnd(); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "gotoend",
    bindKey: bindKey("Ctrl-End|Ctrl-Down", "Command-End|Command-Down"),
    exec: function(editor) { editor.navigateFileEnd(); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "selectdown",
    bindKey: bindKey("Shift-Down", "Shift-Down"),
    exec: function(editor) { editor.getSelection().selectDown(); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "golinedown",
    bindKey: bindKey("Down", "Down|Ctrl-N"),
    exec: function(editor, args) { editor.navigateDown(args.times); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "selectwordleft",
    bindKey: bindKey("Ctrl-Shift-Left", "Option-Shift-Left"),
    exec: function(editor) { editor.getSelection().selectWordLeft(); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "gotowordleft",
    bindKey: bindKey("Ctrl-Left", "Option-Left"),
    exec: function(editor) { editor.navigateWordLeft(); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "selecttolinestart",
    bindKey: bindKey("Alt-Shift-Left", "Command-Shift-Left"),
    exec: function(editor) { editor.getSelection().selectLineStart(); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "gotolinestart",
    bindKey: bindKey("Alt-Left|Home", "Command-Left|Home|Ctrl-A"),
    exec: function(editor) { editor.navigateLineStart(); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "selectleft",
    bindKey: bindKey("Shift-Left", "Shift-Left"),
    exec: function(editor) { editor.getSelection().selectLeft(); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "gotoleft",
    bindKey: bindKey("Left", "Left|Ctrl-B"),
    exec: function(editor, args) { editor.navigateLeft(args.times); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "selectwordright",
    bindKey: bindKey("Ctrl-Shift-Right", "Option-Shift-Right"),
    exec: function(editor) { editor.getSelection().selectWordRight(); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "gotowordright",
    bindKey: bindKey("Ctrl-Right", "Option-Right"),
    exec: function(editor) { editor.navigateWordRight(); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "selecttolineend",
    bindKey: bindKey("Alt-Shift-Right", "Command-Shift-Right"),
    exec: function(editor) { editor.getSelection().selectLineEnd(); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "gotolineend",
    bindKey: bindKey("Alt-Right|End", "Command-Right|End|Ctrl-E"),
    exec: function(editor) { editor.navigateLineEnd(); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "selectright",
    bindKey: bindKey("Shift-Right", "Shift-Right"),
    exec: function(editor) { editor.getSelection().selectRight(); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "gotoright",
    bindKey: bindKey("Right", "Right|Ctrl-F"),
    exec: function(editor, args) { editor.navigateRight(args.times); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "selectpagedown",
    bindKey: bindKey("Shift-PageDown", "Shift-PageDown"),
    exec: function(editor) { editor.selectPageDown(); },
    readOnly: true
}, {
    name: "pagedown",
    bindKey: bindKey(null, "PageDown"),
    exec: function(editor) { editor.scrollPageDown(); },
    readOnly: true
}, {
    name: "gotopagedown",
    bindKey: bindKey("PageDown", "Option-PageDown|Ctrl-V"),
    exec: function(editor) { editor.gotoPageDown(); },
    readOnly: true
}, {
    name: "selectpageup",
    bindKey: bindKey("Shift-PageUp", "Shift-PageUp"),
    exec: function(editor) { editor.selectPageUp(); },
    readOnly: true
}, {
    name: "pageup",
    bindKey: bindKey(null, "PageUp"),
    exec: function(editor) { editor.scrollPageUp(); },
    readOnly: true
}, {
    name: "gotopageup",
    bindKey: bindKey("PageUp", "Option-PageUp"),
    exec: function(editor) { editor.gotoPageUp(); },
    readOnly: true
}, {
    name: "selectlinestart",
    bindKey: bindKey("Shift-Home", "Shift-Home"),
    exec: function(editor) { editor.getSelection().selectLineStart(); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "selectlineend",
    bindKey: bindKey("Shift-End", "Shift-End"),
    exec: function(editor) { editor.getSelection().selectLineEnd(); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "togglerecording",
    bindKey: bindKey("Ctrl-Alt-E", "Command-Option-E"),
    exec: function(editor) { editor.commands.toggleRecording(); },
    readOnly: true
}, {
    name: "replaymacro",
    bindKey: bindKey("Ctrl-Shift-E", "Command-Shift-E"),
    exec: function(editor) { editor.commands.replay(editor); },
    readOnly: true
}, {
    name: "jumptomatching",
    bindKey: bindKey("Ctrl-Shift-P", "Ctrl-Shift-P"),
    exec: function(editor) { editor.jumpToMatching(); },
    multiSelectAction: "forEach",
    readOnly: true
}, 

// commands disabled in readOnly mode
{
    name: "cut",
    exec: function(editor) {
        var range = editor.getSelectionRange();
        editor._emit("cut", range);

        if (!editor.selection.isEmpty()) {
            editor.session.remove(range);
            editor.clearSelection();
        }
    },
    multiSelectAction: "forEach"
}, {
    name: "removeline",
    bindKey: bindKey("Ctrl-D", "Command-D"),
    exec: function(editor) { editor.removeLines(); },
    multiSelectAction: "forEach"
}, {
    name: "togglecomment",
    bindKey: bindKey("Ctrl-/", "Command-/"),
    exec: function(editor) { editor.toggleCommentLines(); },
    multiSelectAction: "forEach"
}, {
    name: "replace",
    bindKey: bindKey("Ctrl-R", "Command-Option-F"),
    exec: function(editor) {
        var needle = prompt("Find:", editor.getCopyText());
        if (!needle)
            return;
        var replacement = prompt("Replacement:");
        if (!replacement)
            return;
        editor.replace(replacement, {needle: needle});
    }
}, {
    name: "replaceall",
    bindKey: bindKey("Ctrl-Shift-R", "Command-Shift-Option-F"),
    exec: function(editor) {
        var needle = prompt("Find:");
        if (!needle)
            return;
        var replacement = prompt("Replacement:");
        if (!replacement)
            return;
        editor.replaceAll(replacement, {needle: needle});
    }
}, {
    name: "undo",
    bindKey: bindKey("Ctrl-Z", "Command-Z"),
    exec: function(editor) { editor.undo(); }
}, {
    name: "redo",
    bindKey: bindKey("Ctrl-Shift-Z|Ctrl-Y", "Command-Shift-Z|Command-Y"),
    exec: function(editor) { editor.redo(); }
}, {
    name: "copylinesup",
    bindKey: bindKey("Ctrl-Alt-Up", "Command-Option-Up"),
    exec: function(editor) { editor.copyLinesUp(); }
}, {
    name: "movelinesup",
    bindKey: bindKey("Alt-Up", "Option-Up"),
    exec: function(editor) { editor.moveLinesUp(); }
}, {
    name: "copylinesdown",
    bindKey: bindKey("Ctrl-Alt-Down", "Command-Option-Down"),
    exec: function(editor) { editor.copyLinesDown(); }
}, {
    name: "movelinesdown",
    bindKey: bindKey("Alt-Down", "Option-Down"),
    exec: function(editor) { editor.moveLinesDown(); }
}, {
    name: "del",
    bindKey: bindKey("Delete", "Delete|Ctrl-D"),
    exec: function(editor) { editor.remove("right"); },
    multiSelectAction: "forEach"
}, {
    name: "backspace",
    bindKey: bindKey(
        "Command-Backspace|Option-Backspace|Shift-Backspace|Backspace",
        "Ctrl-Backspace|Command-Backspace|Shift-Backspace|Backspace|Ctrl-H"
    ),
    exec: function(editor) { editor.remove("left"); },
    multiSelectAction: "forEach"
}, {
    name: "removetolinestart",
    bindKey: bindKey("Alt-Backspace", "Command-Backspace"),
    exec: function(editor) { editor.removeToLineStart(); },
    multiSelectAction: "forEach"
}, {
    name: "removetolineend",
    bindKey: bindKey("Alt-Delete", "Ctrl-K"),
    exec: function(editor) { editor.removeToLineEnd(); },
    multiSelectAction: "forEach"
}, {
    name: "removewordleft",
    bindKey: bindKey("Ctrl-Backspace", "Alt-Backspace|Ctrl-Alt-Backspace"),
    exec: function(editor) { editor.removeWordLeft(); },
    multiSelectAction: "forEach"
}, {
    name: "removewordright",
    bindKey: bindKey("Ctrl-Delete", "Alt-Delete"),
    exec: function(editor) { editor.removeWordRight(); },
    multiSelectAction: "forEach"
}, {
    name: "outdent",
    bindKey: bindKey("Shift-Tab", "Shift-Tab"),
    exec: function(editor) { editor.blockOutdent(); },
    multiSelectAction: "forEach"
}, {
    name: "indent",
    bindKey: bindKey("Tab", "Tab"),
    exec: function(editor) { editor.indent(); },
    multiSelectAction: "forEach"
}, {
    name: "insertstring",
    exec: function(editor, str) { editor.insert(str); },
    multiSelectAction: "forEach"
}, {
    name: "inserttext",
    exec: function(editor, args) {
        editor.insert(lang.stringRepeat(args.text  || "", args.times || 1));
    },
    multiSelectAction: "forEach"
}, {
    name: "splitline",
    bindKey: bindKey(null, "Ctrl-O"),
    exec: function(editor) { editor.splitLine(); },
    multiSelectAction: "forEach"
}, {
    name: "transposeletters",
    bindKey: bindKey("Ctrl-T", "Ctrl-T"),
    exec: function(editor) { editor.transposeLetters(); },
    multiSelectAction: function(editor) {editor.transposeSelections(1); }
}, {
    name: "touppercase",
    bindKey: bindKey("Ctrl-U", "Ctrl-U"),
    exec: function(editor) { editor.toUpperCase(); },
    multiSelectAction: "forEach"
}, {
    name: "tolowercase",
    bindKey: bindKey("Ctrl-Shift-U", "Ctrl-Shift-U"),
    exec: function(editor) { editor.toLowerCase(); },
    multiSelectAction: "forEach"
}];

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
 *      Mihai Sucan <mihai DOT sucan AT gmail DOT com>
 *      Julian Viereck <julian DOT viereck AT gmail DOT com>
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

ace.define('ace/edit_session', ['require', 'exports', 'module' , 'ace/config', 'ace/lib/oop', 'ace/lib/lang', 'ace/lib/net', 'ace/lib/event_emitter', 'ace/selection', 'ace/mode/text', 'ace/range', 'ace/document', 'ace/background_tokenizer', 'ace/edit_session/folding', 'ace/edit_session/bracket_match'], function(require, exports, module) {
"use strict";

var config = require("./config");
var oop = require("./lib/oop");
var lang = require("./lib/lang");
var net = require("./lib/net");
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var Selection = require("./selection").Selection;
var TextMode = require("./mode/text").Mode;
var Range = require("./range").Range;
var Document = require("./document").Document;
var BackgroundTokenizer = require("./background_tokenizer").BackgroundTokenizer;

/**
 * class EditSession
 *
 * Stores various states related to a [[Document `Document`]]. A single `EditSession` can be in charge of several `Document`s.
 *
 **/

/**
 * new EditSession(text, mode)
 * - text (Document | String): If `text` is a `Document`, it associates the `EditSession` with it. Otherwise, a new `Document` is created, with the initial text
 * - mode (TextMode): The inital language mode to use for the document
 *
 * Sets up a new `EditSession` and associates it with the given `Document` and `TextMode`.
 *
 **/

var EditSession = function(text, mode) {
    this.$modified = true;
    this.$breakpoints = [];
    this.$frontMarkers = {};
    this.$backMarkers = {};
    this.$markerId = 1;
    this.$rowCache = [];
    this.$wrapData = [];
    this.$foldData = [];
    this.$undoSelect = true;
    this.$foldData.toString = function() {
        var str = "";
        this.forEach(function(foldLine) {
            str += "\n" + foldLine.toString();
        });
        return str;
    }

    if (text instanceof Document) {
        this.setDocument(text);
    } else {
        this.setDocument(new Document(text));
    }

    this.selection = new Selection(this);
    this.setMode(mode);
};


(function() {

    oop.implement(this, EventEmitter);

    /**
     * EditSession.setDocument(doc) 
     * - doc (Document): The new `Document` to use
     *
     * Sets the `EditSession` to point to a new `Document`. If a `BackgroundTokenizer` exists, it also points to `doc`.
     *
     **/
    this.setDocument = function(doc) {
        if (this.doc)
            throw new Error("Document is already set");

        this.doc = doc;
        doc.on("change", this.onChange.bind(this));
        this.on("changeFold", this.onChangeFold.bind(this));

        if (this.bgTokenizer) {
            this.bgTokenizer.setDocument(this.getDocument());
            this.bgTokenizer.start(0);
        }
    };

    /**
     * EditSession.getDocument() -> Document
     *
     * Returns the `Document` associated with this session. 
     *
     **/
    this.getDocument = function() {
        return this.doc;
    };

    /** internal, hide
     * EditSession.$resetRowCache(row) 
     * - row (Number): The row to work with
     *
     * 
     *
     **/
    this.$resetRowCache = function(row) {
        if (row == 0) {
            this.$rowCache = [];
            return;
        }
        var rowCache = this.$rowCache;
        for (var i = 0; i < rowCache.length; i++) {
            if (rowCache[i].docRow >= row) {
                rowCache.splice(i, rowCache.length);
                return;
            }
        }
    };

    /**
    * EditSession@onChangeFold(e) 
    * 
    * Emitted when a code fold changes its state.
    *
    **/
    this.onChangeFold = function(e) {
        var fold = e.data;
        this.$resetRowCache(fold.start.row);
    };

    /**
    * EditSession@onChange(e) 
    * 
    * Emitted when the document changes.
    **/
    this.onChange = function(e) {
        var delta = e.data;
        this.$modified = true;

        this.$resetRowCache(delta.range.start.row);

        var removedFolds = this.$updateInternalDataOnChange(e);
        if (!this.$fromUndo && this.$undoManager && !delta.ignore) {
            this.$deltasDoc.push(delta);
            if (removedFolds && removedFolds.length != 0) {
                this.$deltasFold.push({
                    action: "removeFolds",
                    folds:  removedFolds
                });
            }

            this.$informUndoManager.schedule();
        }

        this.bgTokenizer.start(delta.range.start.row);
        this._emit("change", e);
    };

    /**
    * EditSession.setValue(text) 
    * - text (String): The new text to place
    *
    * Sets the session text.
    *
    **/
    this.setValue = function(text) {
        this.doc.setValue(text);
        this.selection.moveCursorTo(0, 0);
        this.selection.clearSelection();

        this.$resetRowCache(0);
        this.$deltas = [];
        this.$deltasDoc = [];
        this.$deltasFold = [];
        this.getUndoManager().reset();
    };

    /** alias of: EditSession.toString
    * EditSession.getValue() -> String
    * 
    * Returns the current [[Document `Document`]] as a string. 
    *
    **/
    /** alias of: EditSession.getValue
    * EditSession.toString() -> String
    * 
    * Returns the current [[Document `Document`]] as a string. 
    *
    **/
    this.getValue =
    this.toString = function() {
        return this.doc.getValue();
    };

    /**
    * EditSession.getSelection() -> String
    * 
    * Returns the string of the current selection.
    **/
    this.getSelection = function() {
        return this.selection;
    };

    /** related to: BackgroundTokenizer.getState
     * EditSession.getState(row) -> Array
     * - row (Number): The row to start at
     *
     * {:BackgroundTokenizer.getState}
     *
     **/
    this.getState = function(row) {
        return this.bgTokenizer.getState(row);
    };

    /** related to: BackgroundTokenizer.getTokens
    * EditSession.getTokens(firstRow, lastRow) -> Array
     * - firstRow (Number): The row to start at
     * - lastRow (Number): The row to finish at
     *
     * Starts tokenizing at the row indicated. Returns a list of objects of the tokenized rows.
     *
     **/
    this.getTokens = function(firstRow, lastRow) {
        return this.bgTokenizer.getTokens(firstRow, lastRow);
    };

    /**
    * EditSession.getTokenAt(row, column) -> Array
    * - row (Number): The row number to retrieve from
    * - column (Number): The column number to retrieve from
    *
    * Returns an array of tokens at the indicated row and column.
    **/
    this.getTokenAt = function(row, column) {
        var tokens = this.bgTokenizer.getTokens(row, row)[0].tokens;
        var token, c = 0;
        if (column == null) {
            i = tokens.length - 1;
            c = this.getLine(row).length;
        } else {
            for (var i = 0; i < tokens.length; i++) {
                c += tokens[i].value.length;
                if (c >= column)
                    break;
            }
        }
        token = tokens[i];
        if (!token)
            return null;
        token.index = i;
        token.start = c - token.value.length;
        return token;
    };

    /**
    * EditSession.setUndoManager(undoManager) 
    * - undoManager (UndoManager): The new undo manager
    * 
    * Sets the undo manager.
    **/
    this.setUndoManager = function(undoManager) {
        this.$undoManager = undoManager;
        this.$resetRowCache(0);
        this.$deltas = [];
        this.$deltasDoc = [];
        this.$deltasFold = [];

        if (this.$informUndoManager)
            this.$informUndoManager.cancel();

        if (undoManager) {
            var self = this;
    /** internal, hide
    * EditSession.$syncInformUndoManager() 
    * 
    * 
    **/
            this.$syncInformUndoManager = function() {
                self.$informUndoManager.cancel();

                if (self.$deltasFold.length) {
                    self.$deltas.push({
                        group: "fold",
                        deltas: self.$deltasFold
                    });
                    self.$deltasFold = [];
                }

                if (self.$deltasDoc.length) {
                    self.$deltas.push({
                        group: "doc",
                        deltas: self.$deltasDoc
                    });
                    self.$deltasDoc = [];
                }

                if (self.$deltas.length > 0) {
                    undoManager.execute({
                        action: "aceupdate",
                        args: [self.$deltas, self]
                    });
                }

                self.$deltas = [];
            }
            this.$informUndoManager =
                lang.deferredCall(this.$syncInformUndoManager);
        }
    };

    this.$defaultUndoManager = {
        undo: function() {},
        redo: function() {},
        reset: function() {}
    };

    /**
    * EditSession.getUndoManager() -> UndoManager
    * 
    * Returns the current undo manager.
    **/
    this.getUndoManager = function() {
        return this.$undoManager || this.$defaultUndoManager;
    },

    /**
    * EditSession.getTabString() -> String
    * 
    * Returns the current value for tabs. If the user is using soft tabs, this will be a series of spaces (defined by [[EditSession.getTabSize `getTabSize()`]]); otherwise it's simply `'\t'`.
    **/
    this.getTabString = function() {
        if (this.getUseSoftTabs()) {
            return lang.stringRepeat(" ", this.getTabSize());
        } else {
            return "\t";
        }
    };

    this.$useSoftTabs = true;
    /**
    * EditSession.setUseSoftTabs(useSoftTabs) 
    * - useSoftTabs (Boolean): Value indicating whether or not to use soft tabs
    * 
    * Pass `true` to enable the use of soft tabs. Soft tabs means you're using spaces instead of the tab character (`'\t'`).
    *
    **/
    this.setUseSoftTabs = function(useSoftTabs) {
        if (this.$useSoftTabs === useSoftTabs) return;

        this.$useSoftTabs = useSoftTabs;
    };

    /**
    * EditSession.getUseSoftTabs() -> Boolean
    * 
    * Returns `true` if soft tabs are being used, `false` otherwise.
    *
    **/
    this.getUseSoftTabs = function() {
        return this.$useSoftTabs;
    };

    this.$tabSize = 4;
    /**
    * EditSession.setTabSize(tabSize) 
    * - tabSize (Number): The new tab size
    * 
    * Set the number of spaces that define a soft tab; for example, passing in `4` transforms the soft tabs to be equivalent to four spaces. This function also emits the `changeTabSize` event.
    **/
    this.setTabSize = function(tabSize) {
        if (isNaN(tabSize) || this.$tabSize === tabSize) return;

        this.$modified = true;
        this.$tabSize = tabSize;
        this._emit("changeTabSize");
    };

    /**
    * EditSession.getTabSize() -> Number
    * 
    * Returns the current tab size.
    **/
    this.getTabSize = function() {
        return this.$tabSize;
    };

    /**
    * EditSession.isTabStop(position) -> Boolean
    * - position (Object): The position to check
    * 
    * Returns `true` if the character at the position is a soft tab.
    **/
    this.isTabStop = function(position) {
        return this.$useSoftTabs && (position.column % this.$tabSize == 0);
    };

    this.$overwrite = false;
    /**
    * EditSession.setOverwrite(overwrite) 
    * - overwrite (Boolean): Defines wheter or not to set overwrites
    * 
    * Pass in `true` to enable overwrites in your session, or `false` to disable. If overwrites is enabled, any text you enter will type over any text after it. If the value of `overwrite` changes, this function also emites the `changeOverwrite` event.
    *
    **/
    this.setOverwrite = function(overwrite) {
        if (this.$overwrite == overwrite) return;

        this.$overwrite = overwrite;
        this._emit("changeOverwrite");
    };

    /**
    * EditSession.getOverwrite() -> Boolean
    * 
    * Returns `true` if overwrites are enabled; `false` otherwise.
    **/
    this.getOverwrite = function() {
        return this.$overwrite;
    };

    /**
    * EditSession.toggleOverwrite() 
    * 
    * Sets the value of overwrite to the opposite of whatever it currently is.
    **/
    this.toggleOverwrite = function() {
        this.setOverwrite(!this.$overwrite);
    };

    /**
    * EditSession.getBreakpoints() -> Array
    * 
    * Returns an array of numbers, indicating which rows have breakpoints.
    **/
    this.getBreakpoints = function() {
        return this.$breakpoints;
    };

    /**
    * EditSession.setBreakpoints(rows) 
    * - rows (Array): An array of row indicies
    * 
    * Sets a breakpoint on every row number given by `rows`. This function also emites the `'changeBreakpoint'` event.
    *
    **/
    this.setBreakpoints = function(rows) {
        this.$breakpoints = [];
        for (var i=0; i<rows.length; i++) {
            this.$breakpoints[rows[i]] = true;
        }
        this._emit("changeBreakpoint", {});
    };

    /**
    * EditSession.clearBreakpoints() 
    * 
    * Removes all breakpoints on the rows. This function also emites the `'changeBreakpoint'` event.
    **/
    this.clearBreakpoints = function() {
        this.$breakpoints = [];
        this._emit("changeBreakpoint", {});
    };

    /**
    * EditSession.setBreakpoint(row) 
    * - row (Number): A row index
    * 
    * Sets a breakpoint on the row number given by `rows`. This function also emites the `'changeBreakpoint'` event.
    **/
    this.setBreakpoint = function(row) {
        this.$breakpoints[row] = true;
        this._emit("changeBreakpoint", {});
    };

    /**
    * EditSession.clearBreakpoint(row) 
    * - row (Number): A row index
    * 
    * Removes a breakpoint on the row number given by `rows`. This function also emites the `'changeBreakpoint'` event.
    **/
    this.clearBreakpoint = function(row) {
        delete this.$breakpoints[row];
        this._emit("changeBreakpoint", {});
    };

    /**
    * EditSession.addMarker(range, clazz, type = "line", inFront) -> Number
    * - range (Range): Define the range of the marker
    * - clazz (String): Set the CSS class for the marker
    * - type (Function | String): Identify the type of the marker
    * - inFront (Boolean): Set to `true` to establish a front marker
    *
    * Adds a new marker to the given `Range`. If `inFront` is `true`, a front marker is defined, and the `'changeFrontMarker'` event fires; otherwise, the `'changeBackMarker'` event fires.
    *
    **/
    this.addMarker = function(range, clazz, type, inFront) {
        var id = this.$markerId++;

        var marker = {
            range : range,
            type : type || "line",
            renderer: typeof type == "function" ? type : null,
            clazz : clazz,
            inFront: !!inFront
        }

        if (inFront) {
            this.$frontMarkers[id] = marker;
            this._emit("changeFrontMarker")
        } else {
            this.$backMarkers[id] = marker;
            this._emit("changeBackMarker")
        }

        return id;
    };

    /**
    * EditSession.removeMarker(markerId) 
    * - markerId (Number): A number representing a marker
    *
    * Removes the marker with the specified ID. If this marker was in front, the `'changeFrontMarker'` event is emitted. If the marker was in the back, the `'changeBackMarker'` event is emitted.
    * 
    **/
    this.removeMarker = function(markerId) {
        var marker = this.$frontMarkers[markerId] || this.$backMarkers[markerId];
        if (!marker)
            return;

        var markers = marker.inFront ? this.$frontMarkers : this.$backMarkers;
        if (marker) {
            delete (markers[markerId]);
            this._emit(marker.inFront ? "changeFrontMarker" : "changeBackMarker");
        }
    };

    /**
    * EditSession.getMarkers(inFront) -> Array
    * - inFront (Boolean): If `true`, indicates you only want front markers; `false` indicates only back markers
    *
    * Returns an array containing the IDs of all the markers, either front or back.
    * 
    **/
    this.getMarkers = function(inFront) {
        return inFront ? this.$frontMarkers : this.$backMarkers;
    };

    /*
     * Error:
     *  {
     *    row: 12,
     *    column: 2, //can be undefined
     *    text: "Missing argument",
     *    type: "error" // or "warning" or "info"
     *  }
     */
    /**
    * EditSession.setAnnotations(annotations) 
    * - annotations (Array): A list of annotations
    *
    * Sets annotations for the `EditSession`. This functions emits the `'changeAnnotation'` event.
    **/
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
        this._emit("changeAnnotation", {});
    };

    /**
    * EditSession.getAnnotations() -> Object
    * 
    * Returns the annotations for the `EditSession`. 
    **/
    this.getAnnotations = function() {
        return this.$annotations || {};
    };

    /**
    * EditSession.clearAnnotations() 
    * 
    * Clears all the annotations for this session. This function also triggers the `'changeAnnotation'` event.
    **/
    this.clearAnnotations = function() {
        this.$annotations = {};
        this._emit("changeAnnotation", {});
    };

    /** internal, hide
    * EditSession.$detectNewLine(text) 
    * - text (String): A block of text
    * 
    * If `text` contains either the newline (`\n`) or carriage-return ('\r') characters, `$autoNewLine` stores that value.
    *
    **/
    this.$detectNewLine = function(text) {
        var match = text.match(/^.*?(\r?\n)/m);
        if (match) {
            this.$autoNewLine = match[1];
        } else {
            this.$autoNewLine = "\n";
        }
    };

    /**
    * EditSession.getWordRange(row, column) -> Range
    * - row (Number): The row to start at
    * - column (Number): The column to start at
    *
    * Given a starting row and column, this method returns the `Range` of the first word boundary it finds.
    *
    **/
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

    /**
    * EditSession.getAWordRange(row, column) -> Range
    * - row (Number): The row number to start from
    * - column (Number): The column number to start from
    * 
    * Gets the range of a word, including its right whitespace.
    **/
    this.getAWordRange = function(row, column) {
        var wordRange = this.getWordRange(row, column);
        var line = this.getLine(wordRange.end.row);

        while (line.charAt(wordRange.end.column).match(/[ \t]/)) {
            wordRange.end.column += 1;
        }
        return wordRange;
    };

    /** related to: Document.setNewLineMode
    * EditSession.setNewLineMode(newLineMode) 
    * - newLineMode (String): {:Document.setNewLineMode.param}
    *
    * {:Document.setNewLineMode.desc}
    **/
    this.setNewLineMode = function(newLineMode) {
        this.doc.setNewLineMode(newLineMode);
    };

    /** related to: Document.getNewLineMode
    * EditSession.getNewLineMode() -> String
    * 
    * Returns the current new line mode.
    **/
    this.getNewLineMode = function() {
        return this.doc.getNewLineMode();
    };

    this.$useWorker = true;

    /**
    * EditSession.setUseWorker(useWorker) 
    * - useWorker (Boolean): Set to `true` to use a worker
    * 
    * Identifies if you want to use a worker for the `EditSession`.
    *
    **/
    this.setUseWorker = function(useWorker) {
        if (this.$useWorker == useWorker)
            return;

        this.$useWorker = useWorker;

        this.$stopWorker();
        if (useWorker)
            this.$startWorker();
    };

    /**
    * EditSession.getUseWorker() -> Boolean
    * 
    * Returns `true` if workers are being used.
    **/
    this.getUseWorker = function() {
        return this.$useWorker;
    };

    /**
    * EditSession@onReloadTokenizer(e) 
    * 
    * Reloads all the tokens on the current session. This function calls [[BackgroundTokenizer.start `BackgroundTokenizer.start ()`]] to all the rows; it also emits the `'tokenizerUpdate'` event.
    **/
    this.onReloadTokenizer = function(e) {
        var rows = e.data;
        this.bgTokenizer.start(rows.first);
        this._emit("tokenizerUpdate", e);
    };

    this.$modes = {};
    this._loadMode = function(mode, callback) {
        if (this.$modes[mode])
            return callback(this.$modes[mode]);

        var _self = this;
        var module;
        try {
            module = require(mode);
        } catch (e) {};
        if (module)
            return done(module);

        fetch(function() {
            require([mode], done);
        });

        function done(module) {
            if (_self.$modes[mode])
                return callback(_self.$modes[mode]);

            _self.$modes[mode] = new module.Mode();
            _self.$modes[mode].$id = mode;
            _self._emit("loadmode", {
                name: mode,
                mode: _self.$modes[mode]
            });
            callback(_self.$modes[mode]);
        }

        function fetch(callback) {
            if (!config.get("packaged"))
                return callback();

            var base = mode.split("/").pop();
            var filename = config.get("modePath") + "/mode-" + base + config.get("suffix");
            net.loadScript(filename, callback);
        }
    };

    /**
    * EditSession.setMode(mode) 
    * - mode (TextMode): Set a new text mode
    *
    * Sets a new text mode for the `EditSession`. This method also emits the `'changeMode'` event. If a [[BackgroundTokenizer `BackgroundTokenizer`]] is set, the `'tokenizerUpdate'` event is also emitted.
    *
    **/
    this.$mode = null;
    this.$modeId = null;
    this.setMode = function(mode) {
        // load on demand
        if (typeof mode === "string") {
            if (this.$modeId == mode)
                return;

            this.$modeId = mode;
            var _self = this;
            this._loadMode(mode, function(module) {
                if (_self.$modeId !== mode)
                    return;

                _self.setMode(module);
            });
            return;
        } else if (mode == null) {
            mode = "ace/mode/text"
            this.$modeId = mode;
            this.$modes[mode] = this.$modes[mode] || (new TextMode());
            this.setMode(this.$modes[mode]);
            return;
        }

        if (this.$mode === mode) return;
        this.$mode = mode;
        this.$modeId = mode.$id;

        this.$stopWorker();

        if (this.$useWorker)
            this.$startWorker();

        var tokenizer = mode.getTokenizer();

        if(tokenizer.addEventListener !== undefined) {
            var onReloadTokenizer = this.onReloadTokenizer.bind(this);
            tokenizer.addEventListener("update", onReloadTokenizer);
        }

        if (!this.bgTokenizer) {
            this.bgTokenizer = new BackgroundTokenizer(tokenizer);
            var _self = this;
            this.bgTokenizer.addEventListener("update", function(e) {
                _self._emit("tokenizerUpdate", e);
            });
        } else {
            this.bgTokenizer.setTokenizer(tokenizer);
        }

        this.bgTokenizer.setDocument(this.getDocument());
        this.bgTokenizer.start(0);

        this.tokenRe = mode.tokenRe;
        this.nonTokenRe = mode.nonTokenRe;

        this.$setFolding(mode.foldingRules);

        this._emit("changeMode");
    };

    /** internal, hide
    * EditSession.stopWorker() 
    *
    *
    **/
    this.$stopWorker = function() {
        if (this.$worker)
            this.$worker.terminate();

        this.$worker = null;
    };

    /** internal, hide
    * EditSession.$startWorker() 
    *
    *
    **/
    this.$startWorker = function() {
        if (typeof Worker !== "undefined" && !require.noWorker) {
            try {
                this.$worker = this.$mode.createWorker(this);
            } catch (e) {
                console.log("Could not load worker");
                console.log(e);
                this.$worker = null;
            }
        }
        else
            this.$worker = null;
    };

    /**
    * EditSession.getMode() -> TextMode
    * 
    * Returns the current text mode.
    **/
    this.getMode = function() {
        return this.$mode;
    };

    this.$scrollTop = 0;
    /**
    * EditSession.setScrollTop(scrollTop) 
    * - scrollTop (Number): The new scroll top value
    *
    * This function sets the scroll top value. It also emits the `'changeScrollTop'` event.
    **/
    this.setScrollTop = function(scrollTop) {
        scrollTop = Math.round(Math.max(0, scrollTop));
        if (this.$scrollTop === scrollTop)
            return;

        this.$scrollTop = scrollTop;
        this._emit("changeScrollTop", scrollTop);
    };

    /**
    * EditSession.getScrollTop() -> Number
    * 
    * [Returns the value of the distance between the top of the editor and the topmost part of the visible content.]{: #EditSession.getScrollTop}
    **/
    this.getScrollTop = function() {
        return this.$scrollTop;
    };

    this.$scrollLeft = 0;
    /**
    * EditSession.setScrollLeft(scrollLeft) 
    * 
    * [Sets the value of the distance between the left of the editor and the leftmost part of the visible content.]{: #EditSession.setScrollLeft}
    **/
    this.setScrollLeft = function(scrollLeft) {
        scrollLeft = Math.round(Math.max(0, scrollLeft));
        if (this.$scrollLeft === scrollLeft)
            return;

        this.$scrollLeft = scrollLeft;
        this._emit("changeScrollLeft", scrollLeft);
    };

    /**
    * EditSession.getScrollLeft() -> Number
    * 
    * [Returns the value of the distance between the left of the editor and the leftmost part of the visible content.]{: #EditSession.getScrollLeft}
    **/
    this.getScrollLeft = function() {
        return this.$scrollLeft;
    };

    /**
    * EditSession.getWidth() -> Number
    * 
    * Returns the width of the document.
    **/
    this.getWidth = function() {
        this.$computeWidth();
        return this.width;
    };

    /**
    * EditSession.getScreenWidth() -> Number
    * 
    * Returns the width of the screen.
    **/
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

            for ( var i = 0; i < lines.length; i++) {
                var foldLine = this.getFoldLine(i),
                    line, len;

                line = lines[i];
                if (foldLine) {
                    var end = foldLine.range.end;
                    line = this.getFoldDisplayLine(foldLine);
                    // Continue after the foldLine.end.row. All the lines in
                    // between are folded.
                    i = end.row;
                }
                len = line.length;
                longestLine = Math.max(longestLine, len);
                if (!this.$useWrapMode) {
                    longestScreenLine = Math.max(
                        longestScreenLine,
                        this.$getStringScreenWidth(line)[0]
                    );
                }
            }
            this.width = longestLine;

            if (this.$useWrapMode) {
                this.screenWidth = this.$wrapLimit;
            } else {
                this.screenWidth = longestScreenLine;
            }
        }
    };

    /** related to: Document.getLine
    * EditSession.getLine(row) -> String
    * - row (Number): The row to retrieve from
    * 
    * Returns a verbatim copy of the given line as it is in the document
    *
    **/
    this.getLine = function(row) {
        return this.doc.getLine(row);
    };

    /** related to: Document.getLines
    * EditSession.getLines(firstRow, lastRow) -> Array
    * - firstRow (Number): The first row index to retrieve
    * - lastRow (Number): The final row index to retrieve
    * 
    * Returns an array of strings of the rows between `firstRow` and `lastRow`. This function is inclusive of `lastRow`.
    *
    **/
    this.getLines = function(firstRow, lastRow) {
        return this.doc.getLines(firstRow, lastRow);
    };

    /** related to: Document.getLength
    * EditSession.getLength()-> Number
    * 
    * Returns the number of rows in the document.
    **/
    this.getLength = function() {
        return this.doc.getLength();
    };

    /** related to: Document.getTextRange
    * EditSession.getTextRange(range) -> Array
    * - range (String): The range to work with
    * 
    * {:Document.getTextRange.desc}
    **/
    this.getTextRange = function(range) {
        return this.doc.getTextRange(range);
    };

    /** related to: Document.insert
    * EditSession.insert(position, text) -> Number
    * - position (Number): The position to start inserting at 
    * - text (String): A chunk of text to insert
    * + (Number): The position of the last line of `text`. If the length of `text` is 0, this function simply returns `position`. 
    *
    * Inserts a block of `text` and the indicated `position`.
    *
    * 
    **/
    this.insert = function(position, text) {
        return this.doc.insert(position, text);
    };

    /** related to: Document.remove
    * EditSession.remove(range) -> Object
    * - range (Range): A specified Range to remove
    * + (Object): The new `start` property of the range, which contains `startRow` and `startColumn`. If `range` is empty, this function returns the unmodified value of `range.start`.
    * 
    * Removes the `range` from the document.
    *
    *  
    **/
    this.remove = function(range) {
        return this.doc.remove(range);
    };

    /**
    * EditSession.undoChanges(deltas, dontSelect) -> Range
    * - deltas (Array): An array of previous changes
    * - dontSelect (Boolean): [If `true`, doesn't select the range of where the change occured]{: #dontSelect}
    *
    * Reverts previous changes to your document.
    **/
    this.undoChanges = function(deltas, dontSelect) {
        if (!deltas.length)
            return;

        this.$fromUndo = true;
        var lastUndoRange = null;
        for (var i = deltas.length - 1; i != -1; i--) {
            var delta = deltas[i];
            if (delta.group == "doc") {
                this.doc.revertDeltas(delta.deltas);
                lastUndoRange =
                    this.$getUndoSelection(delta.deltas, true, lastUndoRange);
            } else {
                delta.deltas.forEach(function(foldDelta) {
                    this.addFolds(foldDelta.folds);
                }, this);
            }
        }
        this.$fromUndo = false;
        lastUndoRange &&
            this.$undoSelect &&
            !dontSelect &&
            this.selection.setSelectionRange(lastUndoRange);
        return lastUndoRange;
    };

    /**
    * EditSession.redoChanges(deltas, dontSelect) -> Range
    * - deltas (Array): An array of previous changes
    * - dontSelect (Boolean): {:dontSelect}
    *
    * Re-implements a previously undone change to your document.
    **/
    this.redoChanges = function(deltas, dontSelect) {
        if (!deltas.length)
            return;

        this.$fromUndo = true;
        var lastUndoRange = null;
        for (var i = 0; i < deltas.length; i++) {
            var delta = deltas[i];
            if (delta.group == "doc") {
                this.doc.applyDeltas(delta.deltas);
                lastUndoRange =
                    this.$getUndoSelection(delta.deltas, false, lastUndoRange);
            }
        }
        this.$fromUndo = false;
        lastUndoRange &&
            this.$undoSelect &&
            !dontSelect &&
            this.selection.setSelectionRange(lastUndoRange);
        return lastUndoRange;
    };
    
    /**
    * EditSession.setUndoSelect(enable) 
    * - enable (Boolean): If `true`, selects the range of the reinserted change
    *
    * ENables or disables highlighting of the range where an undo occured.
    **/
    this.setUndoSelect = function(enable) {
        this.$undoSelect = enable;
    };

    /** internal, hide
    * EditSession.$getUndoSelection(deltas, isUndo, lastUndoRange) -> Range
    * 
    * 
    **/
    this.$getUndoSelection = function(deltas, isUndo, lastUndoRange) {
        function isInsert(delta) {
            var insert =
                delta.action == "insertText" || delta.action == "insertLines";
            return isUndo ? !insert : insert;
        }

        var delta = deltas[0];
        var range, point;
        var lastDeltaIsInsert = false;
        if (isInsert(delta)) {
            range = delta.range.clone();
            lastDeltaIsInsert = true;
        } else {
            range = Range.fromPoints(delta.range.start, delta.range.start);
            lastDeltaIsInsert = false;
        }

        for (var i = 1; i < deltas.length; i++) {
            delta = deltas[i];
            if (isInsert(delta)) {
                point = delta.range.start;
                if (range.compare(point.row, point.column) == -1) {
                    range.setStart(delta.range.start);
                }
                point = delta.range.end;
                if (range.compare(point.row, point.column) == 1) {
                    range.setEnd(delta.range.end);
                }
                lastDeltaIsInsert = true;
            } else {
                point = delta.range.start;
                if (range.compare(point.row, point.column) == -1) {
                    range =
                        Range.fromPoints(delta.range.start, delta.range.start);
                }
                lastDeltaIsInsert = false;
            }
        }

        // Check if this range and the last undo range has something in common.
        // If true, merge the ranges.
        if (lastUndoRange != null) {
            var cmp = lastUndoRange.compareRange(range);
            if (cmp == 1) {
                range.setStart(lastUndoRange.start);
            } else if (cmp == -1) {
                range.setEnd(lastUndoRange.end);
            }
        }

        return range;
    },

    /** related to: Document.replace
    * EditSession.replace(range, text) -> Object
    * - range (Range): A specified Range to replace
    * - text (String): The new text to use as a replacement
    * + (Object): Returns an object containing the final row and column, like this:<br/>
    * ```{row: endRow, column: 0}```<br/>
    * If the text and range are empty, this function returns an object containing the current `range.start` value.<br/>
    * If the text is the exact same as what currently exists, this function returns an object containing the current `range.end` value.
    *
    * Replaces a range in the document with the new `text`.
    *
    * 
    *
    **/
    this.replace = function(range, text) {
        return this.doc.replace(range, text);
    };

    /**
    * EditSession.moveText(fromRange, toPosition) -> Range
    * - fromRange (Range): The range of text you want moved within the document
    * - toPosition (Object): The location (row and column) where you want to move the text to
    * + (Range): The new range where the text was moved to.
    * Moves a range of text from the given range to the given position. `toPosition` is an object that looks like this:
    *
    *    { row: newRowLocation, column: newColumnLocation }
    * 
    *
    *
    **/
    this.moveText = function(fromRange, toPosition) {
        var text = this.getTextRange(fromRange);
        this.remove(fromRange);

        var toRow = toPosition.row;
        var toColumn = toPosition.column;

        // Make sure to update the insert location, when text is removed in
        // front of the chosen point of insertion.
        if (!fromRange.isMultiLine() && fromRange.start.row == toRow &&
            fromRange.end.column < toColumn)
            toColumn -= text.length;

        if (fromRange.isMultiLine() && fromRange.end.row < toRow) {
            var lines = this.doc.$split(text);
            toRow -= lines.length - 1;
        }

        var endRow = toRow + fromRange.end.row - fromRange.start.row;
        var endColumn = fromRange.isMultiLine() ?
                        fromRange.end.column :
                        toColumn + fromRange.end.column - fromRange.start.column;

        var toRange = new Range(toRow, toColumn, endRow, endColumn);

        this.insert(toRange.start, text);

        return toRange;
    };

    /**
    * EditSession.indentRows(startRow, endRow, indentString) 
    * - startRow (Number): Starting row
    * - endRow (Number): Ending row
    * - indentString (String): The indent token
    * 
    * Indents all the rows, from `startRow` to `endRow` (inclusive), by prefixing each row with the token in `indentString`.
    *
    * If `indentString` contains the `'\t'` character, it's replaced by whatever is defined by [[EditSession.getTabString `getTabString()`]].
    *
    **/
    this.indentRows = function(startRow, endRow, indentString) {
        indentString = indentString.replace(/\t/g, this.getTabString());
        for (var row=startRow; row<=endRow; row++)
            this.insert({row: row, column:0}, indentString);
    };

    /**
    * EditSession.outdentRows(range) 
    * - range (Range): A range of rows
    * 
    * Outdents all the rows defined by the `start` and `end` properties of `range`.
    *
    **/
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
            this.remove(deleteRange);
        }
    };

    /** related to: Document.insertLines
    * EditSession.moveLinesUp(firstRow, lastRow) -> Number
    * - firstRow (Number): The starting row to move up
    * - lastRow (Number): The final row to move up
    * + (Number): If `firstRow` is less-than or equal to 0, this function returns 0. Otherwise, on success, it returns -1.
    *
    * Shifts all the lines in the document up one, starting from `firstRow` and ending at `lastRow`.
    *
    *
    **/
    this.moveLinesUp = function(firstRow, lastRow) {
        if (firstRow <= 0) return 0;

        var removed = this.doc.removeLines(firstRow, lastRow);
        this.doc.insertLines(firstRow - 1, removed);
        return -1;
    };

    /** related to: Document.insertLines
    * EditSession.moveLinesDown(firstRow, lastRow) -> Number
    * - firstRow (Number): The starting row to move down
    * - lastRow (Number): The final row to move down
    * + (Number): If `firstRow` is less-than or equal to 0, this function returns 0. Otherwise, on success, it returns -1.
    *
    * 
    *
    **/
    this.moveLinesDown = function(firstRow, lastRow) {
        if (lastRow >= this.doc.getLength()-1) return 0;

        var removed = this.doc.removeLines(firstRow, lastRow);
        this.doc.insertLines(firstRow+1, removed);
        return 1;
    };

    /**
    * EditSession.duplicateLines(firstRow, lastRow) -> Number
    * - firstRow (Number): The starting row to duplicate
    * - lastRow (Number): The final row to duplicate
    * + (Number): Returns the number of new rows added; in other words, `lastRow - firstRow + 1`.
    *
    * Duplicates all the text between `firstRow` and `lastRow`.
    *
    * 
    *
    **/
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

    this.$clipColumnToRow = function(row, column) {
        if (column < 0)
            return 0;
        return Math.min(this.doc.getLine(row).length, column);
    };


    this.$clipPositionToDocument = function(row, column) {
        column = Math.max(0, column);

        if (row < 0) {
            row = 0;
            column = 0;
        } else {
            var len = this.doc.getLength();
            if (row >= len) {
                row = len - 1;
                column = this.doc.getLine(len-1).length;
            } else {
                column = Math.min(this.doc.getLine(row).length, column);
            }
        }

        return {
            row: row,
            column: column
        };
    };

    this.$clipRangeToDocument = function(range) {
        if (range.start.row < 0) {
            range.start.row = 0;
            range.start.column = 0
        } else {
            range.start.column = this.$clipColumnToRow(
                range.start.row,
                range.start.column
            );
        }

        var len = this.doc.getLength() - 1;
        if (range.end.row > len) {
            range.end.row = len;
            range.end.column = this.doc.getLine(len).length;
        } else {
            range.end.column = this.$clipColumnToRow(
                range.end.row,
                range.end.column
            );
        }
        return range;
    };

    // WRAPMODE
    this.$wrapLimit = 80;
    this.$useWrapMode = false;
    this.$wrapLimitRange = {
        min : null,
        max : null
    };

    /**
    * EditSession.setUseWrapMode(useWrapMode) 
    * - useWrapMode (Boolean): Enable (or disable) wrap mode
    *
    * Sets whether or not line wrapping is enabled. If `useWrapMode` is different than the current value, the `'changeWrapMode'` event is emitted.
    **/
    this.setUseWrapMode = function(useWrapMode) {
        if (useWrapMode != this.$useWrapMode) {
            this.$useWrapMode = useWrapMode;
            this.$modified = true;
            this.$resetRowCache(0);

            // If wrapMode is activaed, the wrapData array has to be initialized.
            if (useWrapMode) {
                var len = this.getLength();
                this.$wrapData = [];
                for (var i = 0; i < len; i++) {
                    this.$wrapData.push([]);
                }
                this.$updateWrapData(0, len - 1);
            }

            this._emit("changeWrapMode");
        }
    };

    /**
    * EditSession.getUseWrapMode() -> Boolean
    * 
    * Returns `true` if wrap mode is being used; `false` otherwise.
    **/
    this.getUseWrapMode = function() {
        return this.$useWrapMode;
    };

    // Allow the wrap limit to move freely between min and max. Either
    // parameter can be null to allow the wrap limit to be unconstrained
    // in that direction. Or set both parameters to the same number to pin
    // the limit to that value.
    /**
    * EditSession.setWrapLimitRange(min, max) 
    * - min (Number): The minimum wrap value (the left side wrap)
    * - max (Number): The maximum wrap value (the right side wrap)
    *
    * Sets the boundaries of wrap. Either value can be `null` to have an unconstrained wrap, or, they can be the same number to pin the limit. If the wrap limits for `min` or `max` are different, this method also emits the `'changeWrapMode'` event.
    **/
    this.setWrapLimitRange = function(min, max) {
        if (this.$wrapLimitRange.min !== min || this.$wrapLimitRange.max !== max) {
            this.$wrapLimitRange.min = min;
            this.$wrapLimitRange.max = max;
            this.$modified = true;
            // This will force a recalculation of the wrap limit
            this._emit("changeWrapMode");
        }
    };

    /** internal, hide
    * EditSession.adjustWrapLimit(desiredLimit) -> Boolean
    * - desiredLimit (Number): The new wrap limit
    *
    * This should generally only be called by the renderer when a resize is detected.
    **/
    this.adjustWrapLimit = function(desiredLimit) {
        var wrapLimit = this.$constrainWrapLimit(desiredLimit);
        if (wrapLimit != this.$wrapLimit && wrapLimit > 0) {
            this.$wrapLimit = wrapLimit;
            this.$modified = true;
            if (this.$useWrapMode) {
                this.$updateWrapData(0, this.getLength() - 1);
                this.$resetRowCache(0)
                this._emit("changeWrapLimit");
            }
            return true;
        }
        return false;
    };

    /** internal, hide
    * EditSession.$constrainWrapLimit(wrapLimit) 
    *
    * 
    **/
    this.$constrainWrapLimit = function(wrapLimit) {
        var min = this.$wrapLimitRange.min;
        if (min)
            wrapLimit = Math.max(min, wrapLimit);

        var max = this.$wrapLimitRange.max;
        if (max)
            wrapLimit = Math.min(max, wrapLimit);

        // What would a limit of 0 even mean?
        return Math.max(1, wrapLimit);
    };

    /**
    * EditSession.getWrapLimit() -> Number
    * 
    * Returns the value of wrap limit.
    **/
    this.getWrapLimit = function() {
        return this.$wrapLimit;
    };

    /**
    * EditSession.getWrapLimitRange() -> Object
    * 
    * Returns an object that defines the minimum and maximum of the wrap limit; it looks something like this:
    *
    *     { min: wrapLimitRange_min, max: wrapLimitRange_max }
    *
    **/
    this.getWrapLimitRange = function() {
        // Avoid unexpected mutation by returning a copy
        return {
            min : this.$wrapLimitRange.min,
            max : this.$wrapLimitRange.max
        };
    };

    /** internal, hide
    * EditSession.$updateInternalDataOnChange() 
    *
    * 
    **/
    this.$updateInternalDataOnChange = function(e) {
        var useWrapMode = this.$useWrapMode;
        var len;
        var action = e.data.action;
        var firstRow = e.data.range.start.row;
        var lastRow = e.data.range.end.row;
        var start = e.data.range.start;
        var end = e.data.range.end;
        var removedFolds = null;

        if (action.indexOf("Lines") != -1) {
            if (action == "insertLines") {
                lastRow = firstRow + (e.data.lines.length);
            } else {
                lastRow = firstRow;
            }
            len = e.data.lines ? e.data.lines.length : lastRow - firstRow;
        } else {
            len = lastRow - firstRow;
        }

        if (len != 0) {
            if (action.indexOf("remove") != -1) {
                useWrapMode && this.$wrapData.splice(firstRow, len);

                var foldLines = this.$foldData;
                removedFolds = this.getFoldsInRange(e.data.range);
                this.removeFolds(removedFolds);

                var foldLine = this.getFoldLine(end.row);
                var idx = 0;
                if (foldLine) {
                    foldLine.addRemoveChars(end.row, end.column, start.column - end.column);
                    foldLine.shiftRow(-len);

                    var foldLineBefore = this.getFoldLine(firstRow);
                    if (foldLineBefore && foldLineBefore !== foldLine) {
                        foldLineBefore.merge(foldLine);
                        foldLine = foldLineBefore;
                    }
                    idx = foldLines.indexOf(foldLine) + 1;
                }

                for (idx; idx < foldLines.length; idx++) {
                    var foldLine = foldLines[idx];
                    if (foldLine.start.row >= end.row) {
                        foldLine.shiftRow(-len);
                    }
                }

                lastRow = firstRow;
            } else {
                var args;
                if (useWrapMode) {
                    args = [firstRow, 0];
                    for (var i = 0; i < len; i++) args.push([]);
                    this.$wrapData.splice.apply(this.$wrapData, args);
                }

                // If some new line is added inside of a foldLine, then split
                // the fold line up.
                var foldLines = this.$foldData;
                var foldLine = this.getFoldLine(firstRow);
                var idx = 0;
                if (foldLine) {
                    var cmp = foldLine.range.compareInside(start.row, start.column)
                    // Inside of the foldLine range. Need to split stuff up.
                    if (cmp == 0) {
                        foldLine = foldLine.split(start.row, start.column);
                        foldLine.shiftRow(len);
                        foldLine.addRemoveChars(
                            lastRow, 0, end.column - start.column);
                    } else
                    // Infront of the foldLine but same row. Need to shift column.
                    if (cmp == -1) {
                        foldLine.addRemoveChars(firstRow, 0, end.column - start.column);
                        foldLine.shiftRow(len);
                    }
                    // Nothing to do if the insert is after the foldLine.
                    idx = foldLines.indexOf(foldLine) + 1;
                }

                for (idx; idx < foldLines.length; idx++) {
                    var foldLine = foldLines[idx];
                    if (foldLine.start.row >= firstRow) {
                        foldLine.shiftRow(len);
                    }
                }
            }
        } else {
            // Realign folds. E.g. if you add some new chars before a fold, the
            // fold should "move" to the right.
            len = Math.abs(e.data.range.start.column - e.data.range.end.column);
            if (action.indexOf("remove") != -1) {
                // Get all the folds in the change range and remove them.
                removedFolds = this.getFoldsInRange(e.data.range);
                this.removeFolds(removedFolds);

                len = -len;
            }
            var foldLine = this.getFoldLine(firstRow);
            if (foldLine) {
                foldLine.addRemoveChars(firstRow, start.column, len);
            }
        }

        if (useWrapMode && this.$wrapData.length != this.doc.getLength()) {
            console.error("doc.getLength() and $wrapData.length have to be the same!");
        }

        useWrapMode && this.$updateWrapData(firstRow, lastRow);

        return removedFolds;
    };

    /** internal, hide
    * EditSession.$updateWrapData(firstRow, lastRow) 
    *
    * 
    **/
    this.$updateWrapData = function(firstRow, lastRow) {
        var lines = this.doc.getAllLines();
        var tabSize = this.getTabSize();
        var wrapData = this.$wrapData;
        var wrapLimit = this.$wrapLimit;
        var tokens;
        var foldLine;

        var row = firstRow;
        lastRow = Math.min(lastRow, lines.length - 1);
        while (row <= lastRow) {
            foldLine = this.getFoldLine(row, foldLine);
            if (!foldLine) {
                tokens = this.$getDisplayTokens(lang.stringTrimRight(lines[row]));
                wrapData[row] = this.$computeWrapSplits(tokens, wrapLimit, tabSize);
                row ++;
            } else {
                tokens = [];
                foldLine.walk(
                    function(placeholder, row, column, lastColumn) {
                        var walkTokens;
                        if (placeholder) {
                            walkTokens = this.$getDisplayTokens(
                                            placeholder, tokens.length);
                            walkTokens[0] = PLACEHOLDER_START;
                            for (var i = 1; i < walkTokens.length; i++) {
                                walkTokens[i] = PLACEHOLDER_BODY;
                            }
                        } else {
                            walkTokens = this.$getDisplayTokens(
                                lines[row].substring(lastColumn, column),
                                tokens.length);
                        }
                        tokens = tokens.concat(walkTokens);
                    }.bind(this),
                    foldLine.end.row,
                    lines[foldLine.end.row].length + 1
                );
                // Remove spaces/tabs from the back of the token array.
                while (tokens.length != 0 && tokens[tokens.length - 1] >= SPACE)
                    tokens.pop();

                wrapData[foldLine.start.row]
                    = this.$computeWrapSplits(tokens, wrapLimit, tabSize);
                row = foldLine.end.row + 1;
            }
        }
    };

    // "Tokens"
    var CHAR = 1,
        CHAR_EXT = 2,
        PLACEHOLDER_START = 3,
        PLACEHOLDER_BODY =  4,
        PUNCTUATION = 9,
        SPACE = 10,
        TAB = 11,
        TAB_SPACE = 12;

    /** internal, hide
    * EditSession.$computeWrapSplits(tokens, wrapLimit) -> Array
    *
    * 
    **/
    this.$computeWrapSplits = function(tokens, wrapLimit) {
        if (tokens.length == 0) {
            return [];
        }

        var splits = [];
        var displayLength = tokens.length;
        var lastSplit = 0, lastDocSplit = 0;

        function addSplit(screenPos) {
            var displayed = tokens.slice(lastSplit, screenPos);

            // The document size is the current size - the extra width for tabs
            // and multipleWidth characters.
            var len = displayed.length;
            displayed.join("").
                // Get all the TAB_SPACEs.
                replace(/12/g, function() {
                    len -= 1;
                }).
                // Get all the CHAR_EXT/multipleWidth characters.
                replace(/2/g, function() {
                    len -= 1;
                });

            lastDocSplit += len;
            splits.push(lastDocSplit);
            lastSplit = screenPos;
        }

        while (displayLength - lastSplit > wrapLimit) {
            // This is, where the split should be.
            var split = lastSplit + wrapLimit;

            // If there is a space or tab at this split position, then making
            // a split is simple.
            if (tokens[split] >= SPACE) {
                // Include all following spaces + tabs in this split as well.
                while (tokens[split] >= SPACE) {
                    split ++;
                }
                addSplit(split);
                continue;
            }

            // === ELSE ===
            // Check if split is inside of a placeholder. Placeholder are
            // not splitable. Therefore, seek the beginning of the placeholder
            // and try to place the split beofre the placeholder's start.
            if (tokens[split] == PLACEHOLDER_START
                || tokens[split] == PLACEHOLDER_BODY)
            {
                // Seek the start of the placeholder and do the split
                // before the placeholder. By definition there always
                // a PLACEHOLDER_START between split and lastSplit.
                for (split; split != lastSplit - 1; split--) {
                    if (tokens[split] == PLACEHOLDER_START) {
                        // split++; << No incremental here as we want to
                        //  have the position before the Placeholder.
                        break;
                    }
                }

                // If the PLACEHOLDER_START is not the index of the
                // last split, then we can do the split
                if (split > lastSplit) {
                    addSplit(split);
                    continue;
                }

                // If the PLACEHOLDER_START IS the index of the last
                // split, then we have to place the split after the
                // placeholder. So, let's seek for the end of the placeholder.
                split = lastSplit + wrapLimit;
                for (split; split < tokens.length; split++) {
                    if (tokens[split] != PLACEHOLDER_BODY)
                    {
                        break;
                    }
                }

                // If spilt == tokens.length, then the placeholder is the last
                // thing in the line and adding a new split doesn't make sense.
                if (split == tokens.length) {
                    break;  // Breaks the while-loop.
                }

                // Finally, add the split...
                addSplit(split);
                continue;
            }

            // === ELSE ===
            // Search for the first non space/tab/placeholder/punctuation token backwards.
            var minSplit = Math.max(split - 10, lastSplit - 1);
            while (split > minSplit && tokens[split] < PLACEHOLDER_START) {
                split --;
            }
            while (split > minSplit && tokens[split] == PUNCTUATION) {
                split --;
            }
            // If we found one, then add the split.
            if (split > minSplit) {
                addSplit(++split);
                continue;
            }

            // === ELSE ===
            split = lastSplit + wrapLimit;
            // The split is inside of a CHAR or CHAR_EXT token and no space
            // around -> force a split.
            addSplit(split);
        }
        return splits;
    }

    /** internal, hide
    * EditSession.$getDisplayTokens(str, offset) -> Array
    * - str (String): The string to check
    * - offset (Number): The value to start at
    *
    * Given a string, returns an array of the display characters, including tabs and spaces.
    **/
    this.$getDisplayTokens = function(str, offset) {
        var arr = [];
        var tabSize;
        offset = offset || 0;

        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            // Tab
            if (c == 9) {
                tabSize = this.getScreenTabSize(arr.length + offset);
                arr.push(TAB);
                for (var n = 1; n < tabSize; n++) {
                    arr.push(TAB_SPACE);
                }
            }
            // Space
            else if (c == 32) {
                arr.push(SPACE);
            } else if((c > 39 && c < 48) || (c > 57 && c < 64)) {
                arr.push(PUNCTUATION);
            }
            // full width characters
            else if (c >= 0x1100 && isFullWidth(c)) {
                arr.push(CHAR, CHAR_EXT);
            } else {
                arr.push(CHAR);
            }
        }
        return arr;
    }

    /** internal, hide
    * EditSession.$getStringScreenWidth(str, maxScreenColumn, screenColumn) -> [Number]
    * - str (String): The string to calculate the screen width of
    * - maxScreenColumn (Number): 
    * - screenColumn (Number): 
    * + ([Number]): Returns an `int[]` array with two elements:<br/>
    * The first position indicates the number of columns for `str` on screen.<br/>
    * The second value contains the position of the document column that this function read until.
    *
    * Calculates the width of the string `str` on the screen while assuming that the string starts at the first column on the screen.
    *
    * 
    **/
    this.$getStringScreenWidth = function(str, maxScreenColumn, screenColumn) {
        if (maxScreenColumn == 0) {
            return [0, 0];
        }
        if (maxScreenColumn == null) {
            maxScreenColumn = screenColumn +
                str.length * Math.max(this.getTabSize(), 2);
        }
        screenColumn = screenColumn || 0;

        var c, column;
        for (column = 0; column < str.length; column++) {
            c = str.charCodeAt(column);
            // tab
            if (c == 9) {
                screenColumn += this.getScreenTabSize(screenColumn);
            }
            // full width characters
            else if (c >= 0x1100 && isFullWidth(c)) {
                screenColumn += 2;
            } else {
                screenColumn += 1;
            }
            if (screenColumn > maxScreenColumn) {
                break
            }
        }

        return [screenColumn, column];
    }

    /**
    * EditSession.getRowLength(row) -> Number
    * - row (Number): The row number to check
    * 
    *
    * Returns the length of the indicated row.
    **/
    this.getRowLength = function(row) {
        if (!this.$useWrapMode || !this.$wrapData[row]) {
            return 1;
        } else {
            return this.$wrapData[row].length + 1;
        }
    }

    /**
    * EditSession.getRowHeight(config, row) -> Number
    * - config (Object): An object containing a parameter indicating the `lineHeight`.
    * - row (Number): The row number to check
    *
    * Returns the height of the indicated row. This is mostly relevant for situations where wrapping occurs, and a single line spans across multiple rows.
    *
     **/
    this.getRowHeight = function(config, row) {
        return this.getRowLength(row) * config.lineHeight;
    }

    /** internal, hide, related to: EditSession.documentToScreenColumn
    * EditSession.getScreenLastRowColumn(screenRow) -> Number
    * - screenRow (Number): The screen row to check
    *
    * Returns the column position (on screen) for the last character in the provided row.
    **/
    this.getScreenLastRowColumn = function(screenRow) {
        var pos = this.screenToDocumentPosition(screenRow, Number.MAX_VALUE)
        return this.documentToScreenColumn(pos.row, pos.column);
    };

    /** internal, hide
    * EditSession.getDocumentLastRowColumn(docRow, docColumn) -> Number
    * - docRow (Number): 
    * - docColumn (Number): 
    *
    **/
    this.getDocumentLastRowColumn = function(docRow, docColumn) {
        var screenRow = this.documentToScreenRow(docRow, docColumn);
        return this.getScreenLastRowColumn(screenRow);
    };

    /** internal, hide
    * EditSession.getDocumentLastRowColumnPosition(docRow, docColumn) -> Number
    * 
    **/
    this.getDocumentLastRowColumnPosition = function(docRow, docColumn) {
        var screenRow = this.documentToScreenRow(docRow, docColumn);
        return this.screenToDocumentPosition(screenRow, Number.MAX_VALUE / 10);
    };

    /** internal, hide
    * EditSession.getRowSplitData(row) -> undefined | String
    *
    **/
    this.getRowSplitData = function(row) {
        if (!this.$useWrapMode) {
            return undefined;
        } else {
            return this.$wrapData[row];
        }
    };

    /**
    * EditSession.getScreenTabSize(screenColumn) -> Number
    * - screenColumn (Number): The screen column to check
    * 
    * The distance to the next tab stop at the specified screen column.
    **/
    this.getScreenTabSize = function(screenColumn) {
        return this.$tabSize - screenColumn % this.$tabSize;
    };

    /** internal, hide
    * EditSession.screenToDocumentRow(screenRow, screenColumn) -> Number
    * 
    *
    **/
    this.screenToDocumentRow = function(screenRow, screenColumn) {
        return this.screenToDocumentPosition(screenRow, screenColumn).row;
    };

    /** internal, hide
    * EditSession.screenToDocumentColumn(screenRow, screenColumn) -> Number
    * 
    *
    **/
    this.screenToDocumentColumn = function(screenRow, screenColumn) {
        return this.screenToDocumentPosition(screenRow, screenColumn).column;
    };

    /** related to: EditSession.documentToScreenPosition
    * EditSession.screenToDocumentPosition(screenRow, screenColumn) -> Object
    * - screenRow (Number): The screen row to check
    * - screenColumn (Number): The screen column to check
    * + (Object): The object returned has two properties: `row` and `column`.
    *
    * Converts characters coordinates on the screen to characters coordinates within the document. [This takes into account code folding, word wrap, tab size, and any other visual modifications.]{: #conversionConsiderations}
    *
    * 
    **/
    this.screenToDocumentPosition = function(screenRow, screenColumn) {
        if (screenRow < 0) {
            return {
                row: 0,
                column: 0
            }
        }

        var line;
        var docRow = 0;
        var docColumn = 0;
        var column;
        var row = 0;
        var rowLength = 0;

        var rowCache = this.$rowCache;
        for (var i = 0; i < rowCache.length; i++) {
            if (rowCache[i].screenRow < screenRow) {
                row = rowCache[i].screenRow;
                docRow = rowCache[i].docRow;
            }
            else {
                break;
            }
        }
        var doCache = !rowCache.length || i == rowCache.length;

        var maxRow = this.getLength() - 1;
        var foldLine = this.getNextFoldLine(docRow);
        var foldStart = foldLine ? foldLine.start.row : Infinity;

        while (row <= screenRow) {
            rowLength = this.getRowLength(docRow);
            if (row + rowLength - 1 >= screenRow || docRow >= maxRow) {
                break;
            } else {
                row += rowLength;
                docRow++;
                if (docRow > foldStart) {
                    docRow = foldLine.end.row+1;
                    foldLine = this.getNextFoldLine(docRow, foldLine);
                    foldStart = foldLine ? foldLine.start.row : Infinity;
                }
            }
            if (doCache) {
                rowCache.push({
                    docRow: docRow,
                    screenRow: row
                });
            }
        }

        if (foldLine && foldLine.start.row <= docRow) {
            line = this.getFoldDisplayLine(foldLine);
            docRow = foldLine.start.row;
        } else if (row + rowLength <= screenRow || docRow > maxRow) {
            // clip at the end of the document
            return {
                row: maxRow,
                column: this.getLine(maxRow).length
            }
        } else {
            line = this.getLine(docRow);
            foldLine = null;
        }

        if (this.$useWrapMode) {
            var splits = this.$wrapData[docRow];
            if (splits) {
                column = splits[screenRow - row];
                if(screenRow > row && splits.length) {
                    docColumn = splits[screenRow - row - 1] || splits[splits.length - 1];
                    line = line.substring(docColumn);
                }
            }
        }

        docColumn += this.$getStringScreenWidth(line, screenColumn)[1];

        // We remove one character at the end so that the docColumn
        // position returned is not associated to the next row on the screen.
        if (this.$useWrapMode && docColumn >= column) {
            docColumn = column - 1;
        }

        if (foldLine) {
            return foldLine.idxToPosition(docColumn);
        }

        return {
            row: docRow,
            column: docColumn
        }
    };

    /** related to: EditSession.screenToDocumentPosition
    * EditSession.documentToScreenPosition(docRow, docColumn) -> Object
    * - docRow (Number): The document row to check
    * - docColumn (Number): The document column to check
    * + (Object): The object returned by this method has two properties: `row` and `column`.
    *
    * Converts document coordinates to screen coordinates. {:conversionConsiderations}
    *
    *
    *
    **/
    this.documentToScreenPosition = function(docRow, docColumn) {
        // Normalize the passed in arguments.
        if (typeof docColumn === "undefined")
            var pos = this.$clipPositionToDocument(docRow.row, docRow.column);
        else
            pos = this.$clipPositionToDocument(docRow, docColumn);

        docRow = pos.row;
        docColumn = pos.column;

        var wrapData;
        // Special case in wrapMode if the doc is at the end of the document.
        if (this.$useWrapMode) {
            wrapData = this.$wrapData;
            if (docRow > wrapData.length - 1) {
                return {
                    row: this.getScreenLength(),
                    column: wrapData.length == 0
                        ? 0
                        : (wrapData[wrapData.length - 1].length - 1)
                };
            }
        }

        var screenRow = 0;
        var foldStartRow = null;
        var fold = null;

        // Clamp the docRow position in case it's inside of a folded block.
        fold = this.getFoldAt(docRow, docColumn, 1);
        if (fold) {
            docRow = fold.start.row;
            docColumn = fold.start.column;
        }

        var rowEnd, row = 0;
        var rowCache = this.$rowCache;

        for (var i = 0; i < rowCache.length; i++) {
            if (rowCache[i].docRow < docRow) {
                screenRow = rowCache[i].screenRow;
                row = rowCache[i].docRow;
            } else {
                break;
            }
        }
        var doCache = !rowCache.length || i == rowCache.length;

        var foldLine = this.getNextFoldLine(row);
        var foldStart = foldLine ?foldLine.start.row :Infinity;

        while (row < docRow) {
            if (row >= foldStart) {
                rowEnd = foldLine.end.row + 1;
                if (rowEnd > docRow)
                    break;
                foldLine = this.getNextFoldLine(rowEnd, foldLine);
                foldStart = foldLine ?foldLine.start.row :Infinity;
            }
            else {
                rowEnd = row + 1;
            }

            screenRow += this.getRowLength(row);
            row = rowEnd;

            if (doCache) {
                rowCache.push({
                    docRow: row,
                    screenRow: screenRow
                });
            }
        }

        // Calculate the text line that is displayed in docRow on the screen.
        var textLine = "";
        // Check if the final row we want to reach is inside of a fold.
        if (foldLine && row >= foldStart) {
            textLine = this.getFoldDisplayLine(foldLine, docRow, docColumn);
            foldStartRow = foldLine.start.row;
        } else {
            textLine = this.getLine(docRow).substring(0, docColumn);
            foldStartRow = docRow;
        }
        // Clamp textLine if in wrapMode.
        if (this.$useWrapMode) {
            var wrapRow = wrapData[foldStartRow];
            var screenRowOffset = 0;
            while (textLine.length >= wrapRow[screenRowOffset]) {
                screenRow ++;
                screenRowOffset++;
            }
            textLine = textLine.substring(
                wrapRow[screenRowOffset - 1] || 0, textLine.length
            );
        }

        return {
            row: screenRow,
            column: this.$getStringScreenWidth(textLine)[0]
        };
    };

    /** internal, hide
    * EditSession.documentToScreenColumn(row, docColumn) -> Number
    * 
    * 
    **/
    this.documentToScreenColumn = function(row, docColumn) {
        return this.documentToScreenPosition(row, docColumn).column;
    };

    /** internal, hide
    * EditSession.documentToScreenRow(docRow, docColumn) -> Number
    * 
    * 
    **/
    this.documentToScreenRow = function(docRow, docColumn) {
        return this.documentToScreenPosition(docRow, docColumn).row;
    };

    /**
    * EditSession.getScreenLength() -> Number
    * 
    * Returns the length of the screen.
    **/
    this.getScreenLength = function() {
        var screenRows = 0;
        var fold = null;
        if (!this.$useWrapMode) {
            screenRows = this.getLength();

            // Remove the folded lines again.
            var foldData = this.$foldData;
            for (var i = 0; i < foldData.length; i++) {
                fold = foldData[i];
                screenRows -= fold.end.row - fold.start.row;
            }
        } else {
            var lastRow = this.$wrapData.length;
            var row = 0, i = 0;
            var fold = this.$foldData[i++];
            var foldStart = fold ? fold.start.row :Infinity;

            while (row < lastRow) {
                screenRows += this.$wrapData[row].length + 1;
                row ++;
                if (row > foldStart) {
                    row = fold.end.row+1;
                    fold = this.$foldData[i++];
                    foldStart = fold ?fold.start.row :Infinity;
                }
            }
        }

        return screenRows;
    }

    // For every keystroke this gets called once per char in the whole doc!!
    // Wouldn't hurt to make it a bit faster for c >= 0x1100
    function isFullWidth(c) {
        if (c < 0x1100)
            return false;
        return c >= 0x1100 && c <= 0x115F ||
               c >= 0x11A3 && c <= 0x11A7 ||
               c >= 0x11FA && c <= 0x11FF ||
               c >= 0x2329 && c <= 0x232A ||
               c >= 0x2E80 && c <= 0x2E99 ||
               c >= 0x2E9B && c <= 0x2EF3 ||
               c >= 0x2F00 && c <= 0x2FD5 ||
               c >= 0x2FF0 && c <= 0x2FFB ||
               c >= 0x3000 && c <= 0x303E ||
               c >= 0x3041 && c <= 0x3096 ||
               c >= 0x3099 && c <= 0x30FF ||
               c >= 0x3105 && c <= 0x312D ||
               c >= 0x3131 && c <= 0x318E ||
               c >= 0x3190 && c <= 0x31BA ||
               c >= 0x31C0 && c <= 0x31E3 ||
               c >= 0x31F0 && c <= 0x321E ||
               c >= 0x3220 && c <= 0x3247 ||
               c >= 0x3250 && c <= 0x32FE ||
               c >= 0x3300 && c <= 0x4DBF ||
               c >= 0x4E00 && c <= 0xA48C ||
               c >= 0xA490 && c <= 0xA4C6 ||
               c >= 0xA960 && c <= 0xA97C ||
               c >= 0xAC00 && c <= 0xD7A3 ||
               c >= 0xD7B0 && c <= 0xD7C6 ||
               c >= 0xD7CB && c <= 0xD7FB ||
               c >= 0xF900 && c <= 0xFAFF ||
               c >= 0xFE10 && c <= 0xFE19 ||
               c >= 0xFE30 && c <= 0xFE52 ||
               c >= 0xFE54 && c <= 0xFE66 ||
               c >= 0xFE68 && c <= 0xFE6B ||
               c >= 0xFF01 && c <= 0xFF60 ||
               c >= 0xFFE0 && c <= 0xFFE6;
    };

}).call(EditSession.prototype);

require("./edit_session/folding").Folding.call(EditSession.prototype);
require("./edit_session/bracket_match").BracketMatch.call(EditSession.prototype);

exports.EditSession = EditSession;
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

ace.define('ace/config', ['require', 'exports', 'module' , 'ace/lib/lang'], function(require, exports, module) {
"no use strict";

var lang = require("./lib/lang");

var global = (function() {
    return this;
})();

var options = {
    packaged: false,
    workerPath: "",
    modePath: "",
    themePath: "",
    suffix: ".js"
};

exports.get = function(key) {
    if (!options.hasOwnProperty(key))
        throw new Error("Unknown confik key: " + key);
        
    return options[key];
};

exports.set = function(key, value) {
    if (!options.hasOwnProperty(key))
        throw new Error("Unknown confik key: " + key);
        
    options[key] = value;
};

exports.all = function() {
    return lang.copyObject(options);
};

exports.init = function() {
    options.packaged = require.packaged || module.packaged || (global.define && define.packaged);

    if (!global.document)
        return "";

    var scriptOptions = {};
    var scriptUrl = "";
    var suffix;
    
    var scripts = document.getElementsByTagName("script");
    for (var i=0; i<scripts.length; i++) {
        var script = scripts[i];

        var src = script.src || script.getAttribute("src");
        if (!src) {
            continue;
        }
        
        var attributes = script.attributes;
        for (var j=0, l=attributes.length; j < l; j++) {
            var attr = attributes[j];
            if (attr.name.indexOf("data-ace-") === 0) {
                scriptOptions[deHyphenate(attr.name.replace(/^data-ace-/, ""))] = attr.value;
            }
        }

        var m = src.match(/^(?:(.*\/)ace\.js|(.*\/)ace((-uncompressed)?(-noconflict)?\.js))(?:\?|$)/);
        if (m) {
            scriptUrl = m[1] || m[2];
            suffix = m[3];
        }
    }
    
    if (scriptUrl) {
        scriptOptions.base = scriptOptions.base || scriptUrl;
        scriptOptions.packaged = true;
    }
    
    scriptOptions.suffix = scriptOptions.suffix || suffix;
    scriptOptions.workerPath = scriptOptions.workerPath || scriptOptions.base;
    scriptOptions.modePath = scriptOptions.modePath || scriptOptions.base;
    scriptOptions.themePath = scriptOptions.themePath || scriptOptions.base;
    delete scriptOptions.base;
    
    for (var key in scriptOptions)
        if (typeof scriptOptions[key] !== "undefined")
            exports.set(key, scriptOptions[key]);
};

function deHyphenate(str) {
    return str.replace(/-(.)/g, function(m, m1) { return m1.toUpperCase(); });
}

});
/*
 * based on code from:
 * 
 * @license RequireJS text 0.25.0 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
ace.define('ace/lib/net', ['require', 'exports', 'module' ], function(require, exports, module) {
"use strict";

exports.get = function (url, callback) {
    var xhr = exports.createXhr();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function (evt) {
        //Do not explicitly handle errors, those should be
        //visible via console output in the browser.
        if (xhr.readyState === 4) {
            callback(xhr.responseText);
        }
    };
    xhr.send(null);
};

var progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];

exports.createXhr = function() {
    //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
    var xhr, i, progId;
    if (typeof XMLHttpRequest !== "undefined") {
        return new XMLHttpRequest();
    } else {
        for (i = 0; i < 3; i++) {
            progId = progIds[i];
            try {
                xhr = new ActiveXObject(progId);
            } catch (e) {}

            if (xhr) {
                progIds = [progId];  // so faster next time
                break;
            }
        }
    }

    if (!xhr) {
        throw new Error("createXhr(): XMLHttpRequest not available");
    }

    return xhr;
};

exports.loadScript = function(path, callback) {
    var head = document.getElementsByTagName('head')[0];
    var s = document.createElement('script');

    s.src = path;
    head.appendChild(s);
    
    s.onload = callback;
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

ace.define('ace/selection', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/lib/lang', 'ace/lib/event_emitter', 'ace/range'], function(require, exports, module) {
"use strict";

var oop = require("./lib/oop");
var lang = require("./lib/lang");
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var Range = require("./range").Range;

/**
 * class Selection
 *
 * Contains the cursor position and the text selection of an edit session.
 *
 * The row/columns used in the selection are in document coordinates representing ths coordinates as thez appear in the document before applying soft wrap and folding.
 **/

/**
 * new Selection(session)
 * - session (EditSession): The session to use
 * 
 * Creates a new `Selection` object.
 *
**/
var Selection = function(session) {
    this.session = session;
    this.doc = session.getDocument();

    this.clearSelection();
    this.lead = this.selectionLead = this.doc.createAnchor(0, 0);
    this.anchor = this.selectionAnchor = this.doc.createAnchor(0, 0);

    var self = this;
    this.lead.on("change", function(e) {
        self._emit("changeCursor");
        if (!self.$isEmpty)
            self._emit("changeSelection");
        if (!self.$keepDesiredColumnOnChange && e.old.column != e.value.column)
            self.$desiredColumn = null;
    });

    this.selectionAnchor.on("change", function() {
        if (!self.$isEmpty)
            self._emit("changeSelection");
    });
};

(function() {

    oop.implement(this, EventEmitter);

    /**
    * Selection.isEmpty() -> Boolean
    * 
    * Returns `true` if the selection is empty.
    **/
    this.isEmpty = function() {
        return (this.$isEmpty || (
            this.anchor.row == this.lead.row &&
            this.anchor.column == this.lead.column
        ));
    };

    /**
    * Selection.isMultiLine() -> Boolean
    * 
    * Returns `true` if the selection is a multi-line.
    **/
    this.isMultiLine = function() {
        if (this.isEmpty()) {
            return false;
        }

        return this.getRange().isMultiLine();
    };

    /**
    * Selection.getCursor() -> Number
    * 
    * Gets the current position of the cursor.
    **/
    this.getCursor = function() {
        return this.lead.getPosition();
    };

    /**
    * Selection.setSelectionAnchor(row, column) 
    * - row (Number): The new row
    * - column (Number): The new column
    *
    * Sets the row and column position of the anchor. This function also emits the `'changeSelection'` event.
    **/
    this.setSelectionAnchor = function(row, column) {
        this.anchor.setPosition(row, column);

        if (this.$isEmpty) {
            this.$isEmpty = false;
            this._emit("changeSelection");
        }
    };

    /** related to: Anchor.getPosition
    * Selection.getSelectionAnchor() -> Object
    * 
    * Returns an object containing the `row` and `column` of the calling selection anchor.
    *
    **/
    this.getSelectionAnchor = function() {
        if (this.$isEmpty)
            return this.getSelectionLead()
        else
            return this.anchor.getPosition();
    };

    /** 
    * Selection.getSelectionLead() -> Object
    * 
    * Returns an object containing the `row` and `column` of the calling selection lead.
    **/
    this.getSelectionLead = function() {
        return this.lead.getPosition();
    };

    /**
    * Selection.shiftSelection(columns) 
    * - columns (Number): The number of columns to shift by
    * 
    * Shifts the selection up (or down, if [[Selection.isBackwards `isBackwards()`]] is true) the given number of columns.
    *
    **/
    this.shiftSelection = function(columns) {
        if (this.$isEmpty) {
            this.moveCursorTo(this.lead.row, this.lead.column + columns);
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

    /**
    * Selection.isBackwards() -> Boolean
    * 
    * Returns `true` if the selection is going backwards in the document.
    **/
    this.isBackwards = function() {
        var anchor = this.anchor;
        var lead = this.lead;
        return (anchor.row > lead.row || (anchor.row == lead.row && anchor.column > lead.column));
    };

    /**
    * Selection.getRange() -> Range
    * 
    * [Returns the [[Range `Range`]] for the selected text.]{: #Selection.getRange}
    **/
    this.getRange = function() {
        var anchor = this.anchor;
        var lead = this.lead;

        if (this.isEmpty())
            return Range.fromPoints(lead, lead);

        if (this.isBackwards()) {
            return Range.fromPoints(lead, anchor);
        }
        else {
            return Range.fromPoints(anchor, lead);
        }
    };

    /**
    * Selection.clearSelection() 
    * 
    * [Empties the selection (by de-selecting it). This function also emits the `'changeSelection'` event.]{: #Selection.clearSelection}
    **/
    this.clearSelection = function() {
        if (!this.$isEmpty) {
            this.$isEmpty = true;
            this._emit("changeSelection");
        }
    };

    /**
    * Selection.selectAll() 
    * 
    * Selects all the text in the document.
    **/
    this.selectAll = function() {
        var lastRow = this.doc.getLength() - 1;
        this.setSelectionAnchor(lastRow, this.doc.getLine(lastRow).length);
        this.moveCursorTo(0, 0);
    };

    /**
    * Selection.setSelectionRange(range, reverse) 
    * - range (Range): The range of text to select
    * - reverse (Boolean): Indicates if the range should go backwards (`true`) or not
    *
    * Sets the selection to the provided range.
    *
    **/
    this.setSelectionRange = function(range, reverse) {
        if (reverse) {
            this.setSelectionAnchor(range.end.row, range.end.column);
            this.selectTo(range.start.row, range.start.column);
        } else {
            this.setSelectionAnchor(range.start.row, range.start.column);
            this.selectTo(range.end.row, range.end.column);
        }
        this.$desiredColumn = null;
    };

    this.$moveSelection = function(mover) {
        var lead = this.lead;
        if (this.$isEmpty)
            this.setSelectionAnchor(lead.row, lead.column);

        mover.call(this);
    };

    /**
    * Selection.selectTo(row, column) 
    * - row (Number): The row to select to
    * - column (Number): The column to select to
    *
    * Moves the selection cursor to the indicated row and column.
    *
    **/
    this.selectTo = function(row, column) {
        this.$moveSelection(function() {
            this.moveCursorTo(row, column);
        });
    };

    /**
    * Selection.selectToPosition(pos) 
    * - pos (Object): An object containing the row and column
    * 
    * Moves the selection cursor to the row and column indicated by `pos`.
    *
    **/
    this.selectToPosition = function(pos) {
        this.$moveSelection(function() {
            this.moveCursorToPosition(pos);
        });
    };

    /**
    * Selection.selectUp() 
    * 
    * Moves the selection up one row.
    **/
    this.selectUp = function() {
        this.$moveSelection(this.moveCursorUp);
    };

    /**
    * Selection.selectDown() 
    * 
    * Moves the selection down one row.
    **/
    this.selectDown = function() {
        this.$moveSelection(this.moveCursorDown);
    };

    /**
    * Selection.selectRight() 
    * 
    * Moves the selection right one column.
    **/
    this.selectRight = function() {
        this.$moveSelection(this.moveCursorRight);
    };

    /**
    * Selection.selectLeft() 
    * 
    * Moves the selection left one column.
    **/
    this.selectLeft = function() {
        this.$moveSelection(this.moveCursorLeft);
    };

    /**
    * Selection.selectLineStart() 
    * 
    * Moves the selection to the beginning of the current line.
    **/
    this.selectLineStart = function() {
        this.$moveSelection(this.moveCursorLineStart);
    };

    /**
    * Selection.selectLineEnd() 
    * 
    * Moves the selection to the end of the current line.
    **/
    this.selectLineEnd = function() {
        this.$moveSelection(this.moveCursorLineEnd);
    };

    /**
    * Selection.selectFileEnd() 
    * 
    * Moves the selection to the end of the file.
    **/
    this.selectFileEnd = function() {
        this.$moveSelection(this.moveCursorFileEnd);
    };

    /**
    * Selection.selectFileStart() 
    * 
    * Moves the selection to the start of the file.
    **/
    this.selectFileStart = function() {
        this.$moveSelection(this.moveCursorFileStart);
    };

    /**
    * Selection.selectWordRight() 
    * 
    * Moves the selection to the first word on the right.
    **/
    this.selectWordRight = function() {
        this.$moveSelection(this.moveCursorWordRight);
    };

    /**
    * Selection.selectWordLeft() 
    * 
    * Moves the selection to the first word on the left.
    **/
    this.selectWordLeft = function() {
        this.$moveSelection(this.moveCursorWordLeft);
    };

    /** related to: EditSession.getWordRange
    * Selection.selectWord() 
    * 
    * Moves the selection to highlight the entire word.
    **/
    this.getWordRange = function(row, column) {
        if (typeof column == "undefined") {
            var cursor = row || this.lead;
            row = cursor.row;
            column = cursor.column;
        }
        return this.session.getWordRange(row, column);
    };

    this.selectWord = function() {
        this.setSelectionRange(this.getWordRange());
    };

    /** related to: EditSession.getAWordRange
    * Selection.selectAWord() 
    * 
    * Selects a word, including its right whitespace.
    **/
    this.selectAWord = function() {
        var cursor = this.getCursor();
        var range = this.session.getAWordRange(cursor.row, cursor.column);
        this.setSelectionRange(range);
    };

    this.getLineRange = function(row, excludeLastChar) {
        var rowStart = typeof row == "number" ? row : this.lead.row;
        var rowEnd;

        var foldLine = this.session.getFoldLine(rowStart);
        if (foldLine) {
            rowStart = foldLine.start.row;
            rowEnd = foldLine.end.row;
        } else {
            rowEnd = rowStart;
        }
        if (excludeLastChar)
            return new Range(rowStart, 0, rowEnd, this.session.getLine(rowEnd).length);
        else
            return new Range(rowStart, 0, rowEnd + 1, 0);
    };

    /** 
    * Selection.selectLine() 
    * 
    * Selects the entire line.
    **/
    this.selectLine = function() {
        this.setSelectionRange(this.getLineRange());
    };

    /**
    * Selection.moveCursorUp() 
    * 
    * Moves the cursor up one row.
    **/
    this.moveCursorUp = function() {
        this.moveCursorBy(-1, 0);
    };

    /**
    * Selection.moveCursorDown() 
    * 
    * Moves the cursor down one row.
    **/
    this.moveCursorDown = function() {
        this.moveCursorBy(1, 0);
    };

    /**
    * Selection.moveCursorLeft() 
    * 
    * Moves the cursor left one column.
    **/
    this.moveCursorLeft = function() {
        var cursor = this.lead.getPosition(),
            fold;

        if (fold = this.session.getFoldAt(cursor.row, cursor.column, -1)) {
            this.moveCursorTo(fold.start.row, fold.start.column);
        } else if (cursor.column == 0) {
            // cursor is a line (start
            if (cursor.row > 0) {
                this.moveCursorTo(cursor.row - 1, this.doc.getLine(cursor.row - 1).length);
            }
        }
        else {
            var tabSize = this.session.getTabSize();
            if (this.session.isTabStop(cursor) && this.doc.getLine(cursor.row).slice(cursor.column-tabSize, cursor.column).split(" ").length-1 == tabSize)
                this.moveCursorBy(0, -tabSize);
            else
                this.moveCursorBy(0, -1);
        }
    };

    /**
    * Selection.moveCursorRight() 
    * 
    * Moves the cursor right one column.
    **/
    this.moveCursorRight = function() {
        var cursor = this.lead.getPosition(),
            fold;
        if (fold = this.session.getFoldAt(cursor.row, cursor.column, 1)) {
            this.moveCursorTo(fold.end.row, fold.end.column);
        }
        else if (this.lead.column == this.doc.getLine(this.lead.row).length) {
            if (this.lead.row < this.doc.getLength() - 1) {
                this.moveCursorTo(this.lead.row + 1, 0);
            }
        }
        else {
            var tabSize = this.session.getTabSize();
            var cursor = this.lead;
            if (this.session.isTabStop(cursor) && this.doc.getLine(cursor.row).slice(cursor.column, cursor.column+tabSize).split(" ").length-1 == tabSize)
                this.moveCursorBy(0, tabSize);
            else
                this.moveCursorBy(0, 1);
        }
    };

    /**
    * Selection.moveCursorLineStart() 
    * 
    * Moves the cursor to the start of the line.
    **/
    this.moveCursorLineStart = function() {
        var row = this.lead.row;
        var column = this.lead.column;
        var screenRow = this.session.documentToScreenRow(row, column);

        // Determ the doc-position of the first character at the screen line.
        var firstColumnPosition = this.session.screenToDocumentPosition(screenRow, 0);

        // Determ the line
        var beforeCursor = this.session.getDisplayLine(
            row, null,
            firstColumnPosition.row, firstColumnPosition.column
        );

        var leadingSpace = beforeCursor.match(/^\s*/);
        if (leadingSpace[0].length == column) {
            this.moveCursorTo(
                firstColumnPosition.row, firstColumnPosition.column
            );
        }
        else {
            this.moveCursorTo(
                firstColumnPosition.row,
                firstColumnPosition.column + leadingSpace[0].length
            );
        }
    };

    /**
    * Selection.moveCursorLineEnd() 
    * 
    * Moves the cursor to the end of the line.
    **/
    this.moveCursorLineEnd = function() {
        var lead = this.lead;
        var lastRowColumnPosition =
            this.session.getDocumentLastRowColumnPosition(lead.row, lead.column);
        this.moveCursorTo(
            lastRowColumnPosition.row,
            lastRowColumnPosition.column
        );
    };

    /**
    * Selection.moveCursorFileEnd() 
    * 
    * Moves the cursor to the end of the file.
    **/
    this.moveCursorFileEnd = function() {
        var row = this.doc.getLength() - 1;
        var column = this.doc.getLine(row).length;
        this.moveCursorTo(row, column);
    };

    /**
    * Selection.moveCursorFileStart() 
    * 
    * Moves the cursor to the start of the file.
    **/
    this.moveCursorFileStart = function() {
        this.moveCursorTo(0, 0);
    };

    /**
    * Selection.moveCursorLongWordRight() 
    * 
    * Moves the cursor to the word on the right.
    **/
    this.moveCursorLongWordRight = function() {
        var row = this.lead.row;
        var column = this.lead.column;
        var line = this.doc.getLine(row);
        var rightOfCursor = line.substring(column);

        var match;
        this.session.nonTokenRe.lastIndex = 0;
        this.session.tokenRe.lastIndex = 0;

        // skip folds
        var fold = this.session.getFoldAt(row, column, 1);
        if (fold) {
            this.moveCursorTo(fold.end.row, fold.end.column);
            return;
        }
        
        // first skip space
        if (match = this.session.nonTokenRe.exec(rightOfCursor)) {
            column += this.session.nonTokenRe.lastIndex;
            this.session.nonTokenRe.lastIndex = 0;
            rightOfCursor = line.substring(column);
        }
        
        // if at line end proceed with next line
        if (column >= line.length) {
            this.moveCursorTo(row, line.length);
            this.moveCursorRight();
            if (row < this.doc.getLength() - 1)
                this.moveCursorWordRight();
            return;
        }
        
        // advance to the end of the next token
        if (match = this.session.tokenRe.exec(rightOfCursor)) {
            column += this.session.tokenRe.lastIndex;
            this.session.tokenRe.lastIndex = 0;
        }

        this.moveCursorTo(row, column);
    };

    /**
    * Selection.moveCursorLongWordLeft() 
    * 
    * Moves the cursor to the word on the left.
    **/
    this.moveCursorLongWordLeft = function() {
        var row = this.lead.row;
        var column = this.lead.column;

        // skip folds
        var fold;
        if (fold = this.session.getFoldAt(row, column, -1)) {
            this.moveCursorTo(fold.start.row, fold.start.column);
            return;
        }

        var str = this.session.getFoldStringAt(row, column, -1);
        if (str == null) {
            str = this.doc.getLine(row).substring(0, column)
        }
        
        var leftOfCursor = lang.stringReverse(str);
        var match;
        this.session.nonTokenRe.lastIndex = 0;
        this.session.tokenRe.lastIndex = 0;
        
        // skip whitespace
        if (match = this.session.nonTokenRe.exec(leftOfCursor)) {
            column -= this.session.nonTokenRe.lastIndex;
            leftOfCursor = leftOfCursor.slice(this.session.nonTokenRe.lastIndex);
            this.session.nonTokenRe.lastIndex = 0;
        }
        
        // if at begin of the line proceed in line above
        if (column <= 0) {
            this.moveCursorTo(row, 0);
            this.moveCursorLeft();
            if (row > 0)
                this.moveCursorWordLeft();
            return;
        }

        // move to the begin of the word
        if (match = this.session.tokenRe.exec(leftOfCursor)) {
            column -= this.session.tokenRe.lastIndex;
            this.session.tokenRe.lastIndex = 0;
        }

        this.moveCursorTo(row, column);
    };

    this.$shortWordEndIndex = function(rightOfCursor) {
        var match, index = 0, ch;
        var whitespaceRe = /\s/;
        var tokenRe = this.session.tokenRe;

        tokenRe.lastIndex = 0;
        if (match = this.session.tokenRe.exec(rightOfCursor)) {
            index = this.session.tokenRe.lastIndex;
        } else {
            while ((ch = rightOfCursor[index]) && whitespaceRe.test(ch))
                index ++;

            if (index <= 1) {
                tokenRe.lastIndex = 0;
                 while ((ch = rightOfCursor[index]) && !tokenRe.test(ch)) {
                    tokenRe.lastIndex = 0;
                    index ++;
                    if (whitespaceRe.test(ch)) {
                        if (index > 2) {
                            index--
                            break;
                        } else {
                            while ((ch = rightOfCursor[index]) && whitespaceRe.test(ch))
                                index ++;
                            if (index > 2)
                                break
                        }
                    }
                }
            }
        }
        tokenRe.lastIndex = 0;

        return index;
    };

    this.moveCursorShortWordRight = function() {
        var row = this.lead.row;
        var column = this.lead.column;
        var line = this.doc.getLine(row);
        var rightOfCursor = line.substring(column);

        var fold = this.session.getFoldAt(row, column, 1);
        if (fold)
            return this.moveCursorTo(fold.end.row, fold.end.column);

        if (column == line.length)
            return this.moveCursorRight();

        var index = this.$shortWordEndIndex(rightOfCursor);

        this.moveCursorTo(row, column + index);
    };

    this.moveCursorShortWordLeft = function() {
        var row = this.lead.row;
        var column = this.lead.column;

        var fold;
        if (fold = this.session.getFoldAt(row, column, -1))
            return this.moveCursorTo(fold.start.row, fold.start.column);

        if (column == 0)
            return this.moveCursorLeft();

        var str = this.session.getLine(row).substring(0, column);
        var leftOfCursor = lang.stringReverse(str);
        var index = this.$shortWordEndIndex(leftOfCursor);

        return this.moveCursorTo(row, column - index);
    };

    this.moveCursorWordRight = function() {
        if (this.session.$selectLongWords)
            this.moveCursorLongWordRight();
        else
            this.moveCursorShortWordRight();
    };

    this.moveCursorWordLeft = function() {
        if (this.session.$selectLongWords)
            this.moveCursorLongWordLeft();
        else
            this.moveCursorShortWordLeft();
    };

    /** related to: EditSession.documentToScreenPosition
    * Selection.moveCursorBy(rows, chars) 
    * - rows (Number): The number of rows to move by
    * - chars (Number): The number of characters to move by
    *
    * Moves the cursor to position indicated by the parameters. Negative numbers move the cursor backwards in the document.
    **/
    this.moveCursorBy = function(rows, chars) {
        var screenPos = this.session.documentToScreenPosition(
            this.lead.row,
            this.lead.column
        );

        if (chars === 0) {
            if (this.$desiredColumn)
                screenPos.column = this.$desiredColumn;
            else
                this.$desiredColumn = screenPos.column;
        }

        var docPos = this.session.screenToDocumentPosition(screenPos.row + rows, screenPos.column);

        // move the cursor and update the desired column
        this.moveCursorTo(docPos.row, docPos.column + chars, chars === 0);
    };

    /**
    * Selection.moveCursorToPosition(position) 
    * - position (Object): The position to move to
    * 
    * Moves the selection to the position indicated by its `row` and `column`.
    **/
    this.moveCursorToPosition = function(position) {
        this.moveCursorTo(position.row, position.column);
    };

    /**
    * Selection.moveCursorTo(row, column, keepDesiredColumn) 
    * - row (Number): The row to move to
    * - column (Number): The column to move to
    * - keepDesiredColumn (Boolean): [If `true`, the cursor move does not respect the previous column]{: #preventUpdateBool}
    *
    * Moves the cursor to the row and column provided. [If `preventUpdateDesiredColumn` is `true`, then the cursor stays in the same column position as its original point.]{: #preventUpdateBoolDesc}
    **/
    this.moveCursorTo = function(row, column, keepDesiredColumn) {
        // Ensure the row/column is not inside of a fold.
        var fold = this.session.getFoldAt(row, column, 1);
        if (fold) {
            row = fold.start.row;
            column = fold.start.column;
        }

        this.$keepDesiredColumnOnChange = true;
        this.lead.setPosition(row, column);
        this.$keepDesiredColumnOnChange = false;

        if (!keepDesiredColumn)
            this.$desiredColumn = null;
    };

    /**
    * Selection.moveCursorToScreen(row, column, keepDesiredColumn) 
    * - row (Number): The row to move to
    * - column (Number): The column to move to
    * - keepDesiredColumn (Boolean): {:preventUpdateBool}
    *
    * Moves the cursor to the screen position indicated by row and column. {:preventUpdateBoolDesc}
    **/
    this.moveCursorToScreen = function(row, column, keepDesiredColumn) {
        var pos = this.session.screenToDocumentPosition(row, column);
        this.moveCursorTo(pos.row, pos.column, keepDesiredColumn);
    };

    // remove listeners from document
    this.detach = function() {
        this.lead.detach();
        this.anchor.detach();
        this.session = this.doc = null;
    }

    this.fromOrientedRange = function(range) {
        this.setSelectionRange(range, range.cursor == range.start);
        this.$desiredColumn = range.desiredColumn || this.$desiredColumn;
    }

    this.toOrientedRange = function(range) {
        var r = this.getRange();
        if (range) {
            range.start.column = r.start.column;
            range.start.row = r.start.row;
            range.end.column = r.end.column;
            range.end.row = r.end.row;
        } else {
            range = r;
        }

        range.cursor = this.isBackwards() ? range.start : range.end;
        range.desiredColumn = this.$desiredColumn;
        return range;
    }

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

ace.define('ace/range', ['require', 'exports', 'module' ], function(require, exports, module) {
"use strict";

/**
 * class Range
 *
 * This object is used in various places to indicate a region within the editor. To better visualize how this works, imagine a rectangle. Each quadrant of the rectangle is analogus to a range, as ranges contain a starting row and starting column, and an ending row, and ending column.
 *
 **/

/**
 * new Range(startRow, startColumn, endRow, endColumn)
 * - startRow (Number): The starting row
 * - startColumn (Number): The starting column
 * - endRow (Number): The ending row
 * - endColumn (Number): The ending column
 *
 * Creates a new `Range` object with the given starting and ending row and column points.
 *
 **/
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
    /**
     * Range.isEqual(range) -> Boolean
     * - range (Range): A range to check against
     *
     * Returns `true` if and only if the starting row and column, and ending tow and column, are equivalent to those given by `range`.
     *
     **/ 
    this.isEqual = function(range) {
        return this.start.row == range.start.row &&
            this.end.row == range.end.row &&
            this.start.column == range.start.column &&
            this.end.column == range.end.column
    };

    /**
     * Range.toString() -> String
     *
     * Returns a string containing the range's row and column information, given like this:
     *
     *    [start.row/start.column] -> [end.row/end.column]
     *
     **/ 

    this.toString = function() {
        return ("Range: [" + this.start.row + "/" + this.start.column +
            "] -> [" + this.end.row + "/" + this.end.column + "]");
    };

    /** related to: Range.compare
     * Range.contains(row, column) -> Boolean
     * - row (Number): A row to check for
     * - column (Number): A column to check for
     *
     * Returns `true` if the `row` and `column` provided are within the given range. This can better be expressed as returning `true` if:
     *
     *    this.start.row <= row <= this.end.row &&
     *    this.start.column <= column <= this.end.column
     *
     **/ 

    this.contains = function(row, column) {
        return this.compare(row, column) == 0;
    };

    /** related to: Range.compare
     * Range.compareRange(range) -> Number
     * - range (Range): A range to compare with
     * + (Number): This method returns one of the following numbers:<br/>
     * <br/>
     * * `-2`: (B) is in front of (A), and doesn't intersect with (A)<br/>
     * * `-1`: (B) begins before (A) but ends inside of (A)<br/>
     * * `0`: (B) is completely inside of (A) OR (A) is completely inside of (B)<br/>
     * * `+1`: (B) begins inside of (A) but ends outside of (A)<br/>
     * * `+2`: (B) is after (A) and doesn't intersect with (A)<br/>
     * * `42`: FTW state: (B) ends in (A) but starts outside of (A)
     * 
     * Compares `this` range (A) with another range (B).
     *
     **/ 
    this.compareRange = function(range) {
        var cmp,
            end = range.end,
            start = range.start;

        cmp = this.compare(end.row, end.column);
        if (cmp == 1) {
            cmp = this.compare(start.row, start.column);
            if (cmp == 1) {
                return 2;
            } else if (cmp == 0) {
                return 1;
            } else {
                return 0;
            }
        } else if (cmp == -1) {
            return -2;
        } else {
            cmp = this.compare(start.row, start.column);
            if (cmp == -1) {
                return -1;
            } else if (cmp == 1) {
                return 42;
            } else {
                return 0;
            }
        }
    }

    /** related to: Range.compare
     * Range.comparePoint(p) -> Number
     * - p (Range): A point to compare with
     * + (Number): This method returns one of the following numbers:<br/>
     * * `0` if the two points are exactly equal<br/>
     * * `-1` if `p.row` is less then the calling range<br/>
     * * `1` if `p.row` is greater than the calling range<br/>
     * <br/>
     * If the starting row of the calling range is equal to `p.row`, and:<br/>
     * * `p.column` is greater than or equal to the calling range's starting column, this returns `0`<br/>
     * * Otherwise, it returns -1<br/>
     *<br/>
     * If the ending row of the calling range is equal to `p.row`, and:<br/>
     * * `p.column` is less than or equal to the calling range's ending column, this returns `0`<br/>
     * * Otherwise, it returns 1<br/>
     *
     * Checks the row and column points of `p` with the row and column points of the calling range.
     *
     * 
     *
     **/ 
    this.comparePoint = function(p) {
        return this.compare(p.row, p.column);
    }

    /** related to: Range.comparePoint
     * Range.containsRange(range) -> Boolean
     * - range (Range): A range to compare with
     *
     * Checks the start and end points of `range` and compares them to the calling range. Returns `true` if the `range` is contained within the caller's range.
     *
     **/ 
    this.containsRange = function(range) {
        return this.comparePoint(range.start) == 0 && this.comparePoint(range.end) == 0;
    }

    /**
     * Range.intersects(range) -> Boolean
     * - range (Range): A range to compare with
     *
     * Returns `true` if passed in `range` intersects with the one calling this method.
     *
     **/
    this.intersects = function(range) {
        var cmp = this.compareRange(range);
        return (cmp == -1 || cmp == 0 || cmp == 1);
    }

    /**
     * Range.isEnd(row, column) -> Boolean
     * - row (Number): A row point to compare with
     * - column (Number): A column point to compare with
     *
     * Returns `true` if the caller's ending row point is the same as `row`, and if the caller's ending column is the same as `column`.
     *
     **/
    this.isEnd = function(row, column) {
        return this.end.row == row && this.end.column == column;
    }

    /**
     * Range.isStart(row, column) -> Boolean
     * - row (Number): A row point to compare with
     * - column (Number): A column point to compare with
     *
     * Returns `true` if the caller's starting row point is the same as `row`, and if the caller's starting column is the same as `column`.
     *
     **/ 
    this.isStart = function(row, column) {
        return this.start.row == row && this.start.column == column;
    }

    /**
     * Range.setStart(row, column)
     * - row (Number): A row point to set
     * - column (Number): A column point to set
     *
     * Sets the starting row and column for the range.
     *
     **/ 
    this.setStart = function(row, column) {
        if (typeof row == "object") {
            this.start.column = row.column;
            this.start.row = row.row;
        } else {
            this.start.row = row;
            this.start.column = column;
        }
    }

    /**
     * Range.setEnd(row, column)
     * - row (Number): A row point to set
     * - column (Number): A column point to set
     *
     * Sets the starting row and column for the range.
     *
     **/ 
    this.setEnd = function(row, column) {
        if (typeof row == "object") {
            this.end.column = row.column;
            this.end.row = row.row;
        } else {
            this.end.row = row;
            this.end.column = column;
        }
    }

    /** related to: Range.compare
     * Range.inside(row, column) -> Boolean
     * - row (Number): A row point to compare with
     * - column (Number): A column point to compare with
     *
     * Returns `true` if the `row` and `column` are within the given range.
     *
     **/ 
    this.inside = function(row, column) {
        if (this.compare(row, column) == 0) {
            if (this.isEnd(row, column) || this.isStart(row, column)) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }

    /** related to: Range.compare
     * Range.insideStart(row, column) -> Boolean
     * - row (Number): A row point to compare with
     * - column (Number): A column point to compare with
     *
     * Returns `true` if the `row` and `column` are within the given range's starting points.
     *
     **/ 
    this.insideStart = function(row, column) {
        if (this.compare(row, column) == 0) {
            if (this.isEnd(row, column)) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }

    /** related to: Range.compare
     * Range.insideEnd(row, column) -> Boolean
     * - row (Number): A row point to compare with
     * - column (Number): A column point to compare with
     *
     * Returns `true` if the `row` and `column` are within the given range's ending points.
     *
     **/ 
    this.insideEnd = function(row, column) {
        if (this.compare(row, column) == 0) {
            if (this.isStart(row, column)) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }

    /** 
     * Range.compare(row, column) -> Number
     * - row (Number): A row point to compare with
     * - column (Number): A column point to compare with
     * + (Number): This method returns one of the following numbers:<br/>
     * * `0` if the two points are exactly equal <br/>
     * * `-1` if `p.row` is less then the calling range <br/>
     * * `1` if `p.row` is greater than the calling range <br/>
     *  <br/>
     * If the starting row of the calling range is equal to `p.row`, and: <br/>
     * * `p.column` is greater than or equal to the calling range's starting column, this returns `0`<br/>
     * * Otherwise, it returns -1<br/>
     * <br/>
     * If the ending row of the calling range is equal to `p.row`, and: <br/>
     * * `p.column` is less than or equal to the calling range's ending column, this returns `0` <br/>
     * * Otherwise, it returns 1
     *
     * Checks the row and column points with the row and column points of the calling range.
     *
     *
     **/
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

    /**
     * Range.compareStart(row, column) -> Number
     * - row (Number): A row point to compare with
     * - column (Number): A column point to compare with
     * + (Number): This method returns one of the following numbers:<br/>
     * <br/>
     * * `0` if the two points are exactly equal<br/>
     * * `-1` if `p.row` is less then the calling range<br/>
     * * `1` if `p.row` is greater than the calling range, or if `isStart` is `true`.<br/>
     * <br/>
     * If the starting row of the calling range is equal to `p.row`, and:<br/>
     * * `p.column` is greater than or equal to the calling range's starting column, this returns `0`<br/>
     * * Otherwise, it returns -1<br/>
     * <br/>
     * If the ending row of the calling range is equal to `p.row`, and:<br/>
     * * `p.column` is less than or equal to the calling range's ending column, this returns `0`<br/>
     * * Otherwise, it returns 1
     *
     * Checks the row and column points with the row and column points of the calling range.
     *
     *
     *
     **/
    this.compareStart = function(row, column) {
        if (this.start.row == row && this.start.column == column) {
            return -1;
        } else {
            return this.compare(row, column);
        }
    }

    /**
     * Range.compareEnd(row, column) -> Number
     * - row (Number): A row point to compare with
     * - column (Number): A column point to compare with
     * + (Number): This method returns one of the following numbers:<br/>
     * * `0` if the two points are exactly equal<br/>
     * * `-1` if `p.row` is less then the calling range<br/>
     * * `1` if `p.row` is greater than the calling range, or if `isEnd` is `true.<br/>
     * <br/>
     * If the starting row of the calling range is equal to `p.row`, and:<br/>
     * * `p.column` is greater than or equal to the calling range's starting column, this returns `0`<br/>
     * * Otherwise, it returns -1<br/>
     *<br/>
     * If the ending row of the calling range is equal to `p.row`, and:<br/>
     * * `p.column` is less than or equal to the calling range's ending column, this returns `0`<br/>
     * * Otherwise, it returns 1
     *
     * Checks the row and column points with the row and column points of the calling range.
     *
     *
     **/
    this.compareEnd = function(row, column) {
        if (this.end.row == row && this.end.column == column) {
            return 1;
        } else {
            return this.compare(row, column);
        }
    }

   /** 
     * Range.compareInside(row, column) -> Number
     * - row (Number): A row point to compare with
     * - column (Number): A column point to compare with
     * + (Number): This method returns one of the following numbers:<br/>
     * * `1` if the ending row of the calling range is equal to `row`, and the ending column of the calling range is equal to `column`<br/>
     * * `-1` if the starting row of the calling range is equal to `row`, and the starting column of the calling range is equal to `column`<br/>
     * <br/>
     * Otherwise, it returns the value after calling [[Range.compare `compare()`]].
     *
     * Checks the row and column points with the row and column points of the calling range.
     *
     *
     *
     **/
    this.compareInside = function(row, column) {
        if (this.end.row == row && this.end.column == column) {
            return 1;
        } else if (this.start.row == row && this.start.column == column) {
            return -1;
        } else {
            return this.compare(row, column);
        }
    }

   /** 
     * Range.clipRows(firstRow, lastRow) -> Range
     * - firstRow (Number): The starting row
     * - lastRow (Number): The ending row
     *
     * Returns the part of the current `Range` that occurs within the boundaries of `firstRow` and `lastRow` as a new `Range` object.
     *
    **/
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

   /** 
     * Range.extend(row, column) -> Range
     * - row (Number): A new row to extend to
     * - column (Number): A new column to extend to
     *
     *  Changes the row and column points for the calling range for both the starting and ending points. This method returns that range with a new row.
     *
    **/
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

   /** 
     * Range.isMultiLine() -> Boolean
     *
     * Returns true if the range spans across multiple lines.
     *
    **/
    this.isMultiLine = function() {
        return (this.start.row !== this.end.row);
    };

   /** 
     * Range.clone() -> Range
     *
     * Returns a duplicate of the calling range.
     *
    **/
    this.clone = function() {
        return Range.fromPoints(this.start, this.end);
    };

   /** 
     * Range.collapseRows() -> Range
     *
     * Returns a range containing the starting and ending rows of the original range, but with a column value of `0`.
     *
    **/
    this.collapseRows = function() {
        if (this.end.column == 0)
            return new Range(this.start.row, 0, Math.max(this.start.row, this.end.row-1), 0)
        else
            return new Range(this.start.row, 0, this.end.row, 0)
    };

   /** 
     * Range.toScreenRange(session) -> Range
     * - session (EditSession): The `EditSession` to retrieve coordinates from
     * 
     * Given the current `Range`, this function converts those starting and ending points into screen positions, and then returns a new `Range` object.
    **/
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

/** 
 * Range.fromPoints(start, end) -> Range
 * - start (Range): A starting point to use
 * - end (Range): An ending point to use
 * 
 * Creates and returns a new `Range` based on the row and column of the given parameters.
 *
**/
Range.fromPoints = function(start, end) {
    return new Range(start.row, start.column, end.row, end.column);
};

exports.Range = Range;
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
 *      Mihai Sucan <mihai DOT sucan AT gmail DOT com>
 *      Chris Spencer <chris.ag.spencer AT googlemail DOT com>
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

ace.define('ace/mode/text', ['require', 'exports', 'module' , 'ace/tokenizer', 'ace/mode/text_highlight_rules', 'ace/mode/behaviour', 'ace/unicode'], function(require, exports, module) {
"use strict";

var Tokenizer = require("../tokenizer").Tokenizer;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var Behaviour = require("./behaviour").Behaviour;
var unicode = require("../unicode");

var Mode = function() {
    this.$tokenizer = new Tokenizer(new TextHighlightRules().getRules());
    this.$behaviour = new Behaviour();
};

(function() {

    this.tokenRe = new RegExp("^["
        + unicode.packages.L
        + unicode.packages.Mn + unicode.packages.Mc
        + unicode.packages.Nd
        + unicode.packages.Pc + "\\$_]+", "g"
    );
    
    this.nonTokenRe = new RegExp("^(?:[^"
        + unicode.packages.L
        + unicode.packages.Mn + unicode.packages.Mc
        + unicode.packages.Nd
        + unicode.packages.Pc + "\\$_]|\s])+", "g"
    );

    this.getTokenizer = function() {
        return this.$tokenizer;
    };

    this.toggleCommentLines = function(state, doc, startRow, endRow) {
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

    this.highlightSelection = function(editor) {
        var session = editor.session;
        if (!session.$selectionOccurrences)
            session.$selectionOccurrences = [];

        if (session.$selectionOccurrences.length)
            this.clearSelectionHighlight(editor);

        var selection = editor.getSelectionRange();
        if (selection.isEmpty() || selection.isMultiLine())
            return;

        var startOuter = selection.start.column - 1;
        var endOuter = selection.end.column + 1;
        var line = session.getLine(selection.start.row);
        var lineCols = line.length;
        var needle = line.substring(Math.max(startOuter, 0),
                                    Math.min(endOuter, lineCols));

        // Make sure the outer characters are not part of the word.
        if ((startOuter >= 0 && /^[\w\d]/.test(needle)) ||
            (endOuter <= lineCols && /[\w\d]$/.test(needle)))
            return;

        needle = line.substring(selection.start.column, selection.end.column);
        if (!/^[\w\d]+$/.test(needle))
            return;

        var cursor = editor.getCursorPosition();

        var newOptions = {
            wrap: true,
            wholeWord: true,
            caseSensitive: true,
            needle: needle
        };

        var currentOptions = editor.$search.getOptions();
        editor.$search.set(newOptions);

        var ranges = editor.$search.findAll(session);
        ranges.forEach(function(range) {
            if (!range.contains(cursor.row, cursor.column)) {
                var marker = session.addMarker(range, "ace_selected_word", "text");
                session.$selectionOccurrences.push(marker);
            }
        });

        editor.$search.set(currentOptions);
    };

    this.clearSelectionHighlight = function(editor) {
        if (!editor.session.$selectionOccurrences)
            return;

        editor.session.$selectionOccurrences.forEach(function(marker) {
            editor.session.removeMarker(marker);
        });

        editor.session.$selectionOccurrences = [];
    };
    
    this.createModeDelegates = function (mapping) {
        if (!this.$embeds) {
            return;
        }
        this.$modes = {};
        for (var i = 0; i < this.$embeds.length; i++) {
            if (mapping[this.$embeds[i]]) {
                this.$modes[this.$embeds[i]] = new mapping[this.$embeds[i]]();
            }
        }
        
        var delegations = ['toggleCommentLines', 'getNextLineIndent', 'checkOutdent', 'autoOutdent', 'transformAction'];

        for (var i = 0; i < delegations.length; i++) {
            (function(scope) {
              var functionName = delegations[i];
              var defaultHandler = scope[functionName];
              scope[delegations[i]] = function() {
                  return this.$delegator(functionName, arguments, defaultHandler);
              }
            } (this));
        }
    }
    
    this.$delegator = function(method, args, defaultHandler) {
        var state = args[0];
        
        for (var i = 0; i < this.$embeds.length; i++) {
            if (!this.$modes[this.$embeds[i]]) continue;
            
            var split = state.split(this.$embeds[i]);
            if (!split[0] && split[1]) {
                args[0] = split[1];
                var mode = this.$modes[this.$embeds[i]];
                return mode[method].apply(mode, args);
            }
        }
        var ret = defaultHandler.apply(this, args);
        return defaultHandler ? ret : undefined;
    };
    
    this.transformAction = function(state, action, editor, session, param) {
        if (this.$behaviour) {
            var behaviours = this.$behaviour.getBehaviours();
            for (var key in behaviours) {
                if (behaviours[key][action]) {
                    var ret = behaviours[key][action].apply(this, arguments);
                    if (ret) {
                        return ret;
                    }
                }
            }
        }
    }
    
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

ace.define('ace/tokenizer', ['require', 'exports', 'module' ], function(require, exports, module) {
"use strict";

/**
 * class Tokenizer
 *
 * This class takes a set of highlighting rules, and creates a tokenizer out of them. For more information, see [the wiki on extending highlighters](https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode#wiki-extendingTheHighlighter).
 *
 **/

/**
 * new Tokenizer(rules, flag)
 * - rules (Object): The highlighting rules
 * - flag (String): Any additional regular expression flags to pass (like "i" for case insensitive)
 *
 * Constructs a new tokenizer based on the given rules and flags.
 *
 **/
var Tokenizer = function(rules, flag) {
    flag = flag ? "g" + flag : "g";
    this.rules = rules;

    this.regExps = {};
    this.matchMappings = {};
    for ( var key in this.rules) {
        var rule = this.rules[key];
        var state = rule;
        var ruleRegExps = [];
        var matchTotal = 0;
        var mapping = this.matchMappings[key] = {};

        for ( var i = 0; i < state.length; i++) {

            if (state[i].regex instanceof RegExp)
                state[i].regex = state[i].regex.toString().slice(1, -1);

            // Count number of matching groups. 2 extra groups from the full match
            // And the catch-all on the end (used to force a match);
            var matchcount = new RegExp("(?:(" + state[i].regex + ")|(.))").exec("a").length - 2;

            // Replace any backreferences and offset appropriately.
            var adjustedregex = state[i].regex.replace(/\\([0-9]+)/g, function (match, digit) {
                return "\\" + (parseInt(digit, 10) + matchTotal + 1);
            });

            if (matchcount > 1 && state[i].token.length !== matchcount-1)
                throw new Error("Matching groups and length of the token array don't match in rule #" + i + " of state " + key);

            mapping[matchTotal] = {
                rule: i,
                len: matchcount
            };
            matchTotal += matchcount;

            ruleRegExps.push(adjustedregex);
        }

        this.regExps[key] = new RegExp("(?:(" + ruleRegExps.join(")|(") + ")|(.))", flag);
    }
};

(function() {

    /**
    * Tokenizer.getLineTokens() -> Object
    * 
    * Returns an object containing two properties: `tokens`, which contains all the tokens; and `state`, the current state.
    **/
    this.getLineTokens = function(line, startState) {
        var currentState = startState;
        var state = this.rules[currentState];
        var mapping = this.matchMappings[currentState];
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
            var rule = null;
            var value = [match[0]];

            for (var i = 0; i < match.length-2; i++) {
                if (match[i + 1] === undefined)
                    continue;

                rule = state[mapping[i].rule];

                if (mapping[i].len > 1)
                    value = match.slice(i+2, i+1+mapping[i].len);

                // compute token type
                if (typeof rule.token == "function")
                    type = rule.token.apply(this, value);
                else
                    type = rule.token;

                if (rule.next) {
                    currentState = rule.next;
                    state = this.rules[currentState];
                    mapping = this.matchMappings[currentState];
                    lastIndex = re.lastIndex;

                    re = this.regExps[currentState];
                    re.lastIndex = lastIndex;
                }
                break;
            }

            if (value[0]) {
                if (typeof type == "string") {
                    value = [value.join("")];
                    type = [type];
                }
                for (var i = 0; i < value.length; i++) {
                    if (!value[i])
                        continue;

                    if ((!rule || rule.merge || type[i] === "text") && token.type === type[i]) {
                        token.value += value[i];
                    } else {
                        if (token.type)
                            tokens.push(token);

                        token = {
                            type: type[i],
                            value: value[i]
                        };
                    }
                }
            }

            if (lastIndex == line.length)
                break;

            lastIndex = re.lastIndex;
        }

        if (token.type)
            tokens.push(token);

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

ace.define('ace/mode/text_highlight_rules', ['require', 'exports', 'module' , 'ace/lib/lang'], function(require, exports, module) {
"use strict";

var lang = require("../lib/lang");

var TextHighlightRules = function() {

    // regexp must not have capturing parentheses
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [{
            token : "empty_line",
            regex : '^$'
        }, {
            token : "text",
            regex : ".+"
        }]
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
                }
            }
            this.$rules[prefix + key] = state;
        }
    };

    this.getRules = function() {
        return this.$rules;
    };
    
    this.embedRules = function (HighlightRules, prefix, escapeRules, states) {
        var embedRules = new HighlightRules().getRules();
        if (states) {
            for (var i = 0; i < states.length; i++) {
                states[i] = prefix + states[i];
            }
        } else {
            states = [];
            for (var key in embedRules) {
                states.push(prefix + key);
            }
        }
        this.addRules(embedRules, prefix);
        
        for (var i = 0; i < states.length; i++) {
            Array.prototype.unshift.apply(this.$rules[states[i]], lang.deepCopy(escapeRules));
        }
        
        if (!this.$embeds) {
            this.$embeds = [];
        }
        this.$embeds.push(prefix);
    }
    
    this.getEmbeds = function() {
        return this.$embeds;
    }

}).call(TextHighlightRules.prototype);

exports.TextHighlightRules = TextHighlightRules;
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
 *      Chris Spencer <chris.ag.spencer AT googlemail DOT com>
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

ace.define('ace/mode/behaviour', ['require', 'exports', 'module' ], function(require, exports, module) {
"use strict";

var Behaviour = function() {
   this.$behaviours = {};
};

(function () {

    this.add = function (name, action, callback) {
        switch (undefined) {
          case this.$behaviours:
              this.$behaviours = {};
          case this.$behaviours[name]:
              this.$behaviours[name] = {};
        }
        this.$behaviours[name][action] = callback;
    }
    
    this.addBehaviours = function (behaviours) {
        for (var key in behaviours) {
            for (var action in behaviours[key]) {
                this.add(key, action, behaviours[key][action]);
            }
        }
    }
    
    this.remove = function (name) {
        if (this.$behaviours && this.$behaviours[name]) {
            delete this.$behaviours[name];
        }
    }
    
    this.inherit = function (mode, filter) {
        if (typeof mode === "function") {
            var behaviours = new mode().getBehaviours(filter);
        } else {
            var behaviours = mode.getBehaviours(filter);
        }
        this.addBehaviours(behaviours);
    }
    
    this.getBehaviours = function (filter) {
        if (!filter) {
            return this.$behaviours;
        } else {
            var ret = {}
            for (var i = 0; i < filter.length; i++) {
                if (this.$behaviours[filter[i]]) {
                    ret[filter[i]] = this.$behaviours[filter[i]];
                }
            }
            return ret;
        }
    }

}).call(Behaviour.prototype);

exports.Behaviour = Behaviour;
});
ace.define('ace/unicode', ['require', 'exports', 'module' ], function(require, exports, module) {
"use strict";

/*
XRegExp Unicode plugin pack: Categories 1.0
(c) 2010 Steven Levithan
MIT License
<http://xregexp.com>
Uses the Unicode 5.2 character database

This package for the XRegExp Unicode plugin enables the following Unicode categories (aka properties):

L - Letter (the top-level Letter category is included in the Unicode plugin base script)
    Ll - Lowercase letter
    Lu - Uppercase letter
    Lt - Titlecase letter
    Lm - Modifier letter
    Lo - Letter without case
M - Mark
    Mn - Non-spacing mark
    Mc - Spacing combining mark
    Me - Enclosing mark
N - Number
    Nd - Decimal digit
    Nl - Letter number
    No -  Other number
P - Punctuation
    Pd - Dash punctuation
    Ps - Open punctuation
    Pe - Close punctuation
    Pi - Initial punctuation
    Pf - Final punctuation
    Pc - Connector punctuation
    Po - Other punctuation
S - Symbol
    Sm - Math symbol
    Sc - Currency symbol
    Sk - Modifier symbol
    So - Other symbol
Z - Separator
    Zs - Space separator
    Zl - Line separator
    Zp - Paragraph separator
C - Other
    Cc - Control
    Cf - Format
    Co - Private use
    Cs - Surrogate
    Cn - Unassigned

Example usage:

    \p{N}
    \p{Cn}
*/


// will be populated by addUnicodePackage
exports.packages = {};

addUnicodePackage({
    L:  "0041-005A0061-007A00AA00B500BA00C0-00D600D8-00F600F8-02C102C6-02D102E0-02E402EC02EE0370-037403760377037A-037D03860388-038A038C038E-03A103A3-03F503F7-0481048A-05250531-055605590561-058705D0-05EA05F0-05F20621-064A066E066F0671-06D306D506E506E606EE06EF06FA-06FC06FF07100712-072F074D-07A507B107CA-07EA07F407F507FA0800-0815081A082408280904-0939093D09500958-0961097109720979-097F0985-098C098F09900993-09A809AA-09B009B209B6-09B909BD09CE09DC09DD09DF-09E109F009F10A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A59-0A5C0A5E0A72-0A740A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD0AD00AE00AE10B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D0B5C0B5D0B5F-0B610B710B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BD00C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D0C580C590C600C610C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD0CDE0CE00CE10D05-0D0C0D0E-0D100D12-0D280D2A-0D390D3D0D600D610D7A-0D7F0D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60E01-0E300E320E330E40-0E460E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB00EB20EB30EBD0EC0-0EC40EC60EDC0EDD0F000F40-0F470F49-0F6C0F88-0F8B1000-102A103F1050-1055105A-105D106110651066106E-10701075-1081108E10A0-10C510D0-10FA10FC1100-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA1700-170C170E-17111720-17311740-17511760-176C176E-17701780-17B317D717DC1820-18771880-18A818AA18B0-18F51900-191C1950-196D1970-19741980-19AB19C1-19C71A00-1A161A20-1A541AA71B05-1B331B45-1B4B1B83-1BA01BAE1BAF1C00-1C231C4D-1C4F1C5A-1C7D1CE9-1CEC1CEE-1CF11D00-1DBF1E00-1F151F18-1F1D1F20-1F451F48-1F4D1F50-1F571F591F5B1F5D1F5F-1F7D1F80-1FB41FB6-1FBC1FBE1FC2-1FC41FC6-1FCC1FD0-1FD31FD6-1FDB1FE0-1FEC1FF2-1FF41FF6-1FFC2071207F2090-209421022107210A-211321152119-211D212421262128212A-212D212F-2139213C-213F2145-2149214E218321842C00-2C2E2C30-2C5E2C60-2CE42CEB-2CEE2D00-2D252D30-2D652D6F2D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE2E2F300530063031-3035303B303C3041-3096309D-309F30A1-30FA30FC-30FF3105-312D3131-318E31A0-31B731F0-31FF3400-4DB54E00-9FCBA000-A48CA4D0-A4FDA500-A60CA610-A61FA62AA62BA640-A65FA662-A66EA67F-A697A6A0-A6E5A717-A71FA722-A788A78BA78CA7FB-A801A803-A805A807-A80AA80C-A822A840-A873A882-A8B3A8F2-A8F7A8FBA90A-A925A930-A946A960-A97CA984-A9B2A9CFAA00-AA28AA40-AA42AA44-AA4BAA60-AA76AA7AAA80-AAAFAAB1AAB5AAB6AAB9-AABDAAC0AAC2AADB-AADDABC0-ABE2AC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA2DFA30-FA6DFA70-FAD9FB00-FB06FB13-FB17FB1DFB1F-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF21-FF3AFF41-FF5AFF66-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",
    Ll: "0061-007A00AA00B500BA00DF-00F600F8-00FF01010103010501070109010B010D010F01110113011501170119011B011D011F01210123012501270129012B012D012F01310133013501370138013A013C013E014001420144014601480149014B014D014F01510153015501570159015B015D015F01610163016501670169016B016D016F0171017301750177017A017C017E-0180018301850188018C018D019201950199-019B019E01A101A301A501A801AA01AB01AD01B001B401B601B901BA01BD-01BF01C601C901CC01CE01D001D201D401D601D801DA01DC01DD01DF01E101E301E501E701E901EB01ED01EF01F001F301F501F901FB01FD01FF02010203020502070209020B020D020F02110213021502170219021B021D021F02210223022502270229022B022D022F02310233-0239023C023F0240024202470249024B024D024F-02930295-02AF037103730377037B-037D039003AC-03CE03D003D103D5-03D703D903DB03DD03DF03E103E303E503E703E903EB03ED03EF-03F303F503F803FB03FC0430-045F04610463046504670469046B046D046F04710473047504770479047B047D047F0481048B048D048F04910493049504970499049B049D049F04A104A304A504A704A904AB04AD04AF04B104B304B504B704B904BB04BD04BF04C204C404C604C804CA04CC04CE04CF04D104D304D504D704D904DB04DD04DF04E104E304E504E704E904EB04ED04EF04F104F304F504F704F904FB04FD04FF05010503050505070509050B050D050F05110513051505170519051B051D051F0521052305250561-05871D00-1D2B1D62-1D771D79-1D9A1E011E031E051E071E091E0B1E0D1E0F1E111E131E151E171E191E1B1E1D1E1F1E211E231E251E271E291E2B1E2D1E2F1E311E331E351E371E391E3B1E3D1E3F1E411E431E451E471E491E4B1E4D1E4F1E511E531E551E571E591E5B1E5D1E5F1E611E631E651E671E691E6B1E6D1E6F1E711E731E751E771E791E7B1E7D1E7F1E811E831E851E871E891E8B1E8D1E8F1E911E931E95-1E9D1E9F1EA11EA31EA51EA71EA91EAB1EAD1EAF1EB11EB31EB51EB71EB91EBB1EBD1EBF1EC11EC31EC51EC71EC91ECB1ECD1ECF1ED11ED31ED51ED71ED91EDB1EDD1EDF1EE11EE31EE51EE71EE91EEB1EED1EEF1EF11EF31EF51EF71EF91EFB1EFD1EFF-1F071F10-1F151F20-1F271F30-1F371F40-1F451F50-1F571F60-1F671F70-1F7D1F80-1F871F90-1F971FA0-1FA71FB0-1FB41FB61FB71FBE1FC2-1FC41FC61FC71FD0-1FD31FD61FD71FE0-1FE71FF2-1FF41FF61FF7210A210E210F2113212F21342139213C213D2146-2149214E21842C30-2C5E2C612C652C662C682C6A2C6C2C712C732C742C76-2C7C2C812C832C852C872C892C8B2C8D2C8F2C912C932C952C972C992C9B2C9D2C9F2CA12CA32CA52CA72CA92CAB2CAD2CAF2CB12CB32CB52CB72CB92CBB2CBD2CBF2CC12CC32CC52CC72CC92CCB2CCD2CCF2CD12CD32CD52CD72CD92CDB2CDD2CDF2CE12CE32CE42CEC2CEE2D00-2D25A641A643A645A647A649A64BA64DA64FA651A653A655A657A659A65BA65DA65FA663A665A667A669A66BA66DA681A683A685A687A689A68BA68DA68FA691A693A695A697A723A725A727A729A72BA72DA72F-A731A733A735A737A739A73BA73DA73FA741A743A745A747A749A74BA74DA74FA751A753A755A757A759A75BA75DA75FA761A763A765A767A769A76BA76DA76FA771-A778A77AA77CA77FA781A783A785A787A78CFB00-FB06FB13-FB17FF41-FF5A",
    Lu: "0041-005A00C0-00D600D8-00DE01000102010401060108010A010C010E01100112011401160118011A011C011E01200122012401260128012A012C012E01300132013401360139013B013D013F0141014301450147014A014C014E01500152015401560158015A015C015E01600162016401660168016A016C016E017001720174017601780179017B017D018101820184018601870189-018B018E-0191019301940196-0198019C019D019F01A001A201A401A601A701A901AC01AE01AF01B1-01B301B501B701B801BC01C401C701CA01CD01CF01D101D301D501D701D901DB01DE01E001E201E401E601E801EA01EC01EE01F101F401F6-01F801FA01FC01FE02000202020402060208020A020C020E02100212021402160218021A021C021E02200222022402260228022A022C022E02300232023A023B023D023E02410243-02460248024A024C024E03700372037603860388-038A038C038E038F0391-03A103A3-03AB03CF03D2-03D403D803DA03DC03DE03E003E203E403E603E803EA03EC03EE03F403F703F903FA03FD-042F04600462046404660468046A046C046E04700472047404760478047A047C047E0480048A048C048E04900492049404960498049A049C049E04A004A204A404A604A804AA04AC04AE04B004B204B404B604B804BA04BC04BE04C004C104C304C504C704C904CB04CD04D004D204D404D604D804DA04DC04DE04E004E204E404E604E804EA04EC04EE04F004F204F404F604F804FA04FC04FE05000502050405060508050A050C050E05100512051405160518051A051C051E0520052205240531-055610A0-10C51E001E021E041E061E081E0A1E0C1E0E1E101E121E141E161E181E1A1E1C1E1E1E201E221E241E261E281E2A1E2C1E2E1E301E321E341E361E381E3A1E3C1E3E1E401E421E441E461E481E4A1E4C1E4E1E501E521E541E561E581E5A1E5C1E5E1E601E621E641E661E681E6A1E6C1E6E1E701E721E741E761E781E7A1E7C1E7E1E801E821E841E861E881E8A1E8C1E8E1E901E921E941E9E1EA01EA21EA41EA61EA81EAA1EAC1EAE1EB01EB21EB41EB61EB81EBA1EBC1EBE1EC01EC21EC41EC61EC81ECA1ECC1ECE1ED01ED21ED41ED61ED81EDA1EDC1EDE1EE01EE21EE41EE61EE81EEA1EEC1EEE1EF01EF21EF41EF61EF81EFA1EFC1EFE1F08-1F0F1F18-1F1D1F28-1F2F1F38-1F3F1F48-1F4D1F591F5B1F5D1F5F1F68-1F6F1FB8-1FBB1FC8-1FCB1FD8-1FDB1FE8-1FEC1FF8-1FFB21022107210B-210D2110-211221152119-211D212421262128212A-212D2130-2133213E213F214521832C00-2C2E2C602C62-2C642C672C692C6B2C6D-2C702C722C752C7E-2C802C822C842C862C882C8A2C8C2C8E2C902C922C942C962C982C9A2C9C2C9E2CA02CA22CA42CA62CA82CAA2CAC2CAE2CB02CB22CB42CB62CB82CBA2CBC2CBE2CC02CC22CC42CC62CC82CCA2CCC2CCE2CD02CD22CD42CD62CD82CDA2CDC2CDE2CE02CE22CEB2CEDA640A642A644A646A648A64AA64CA64EA650A652A654A656A658A65AA65CA65EA662A664A666A668A66AA66CA680A682A684A686A688A68AA68CA68EA690A692A694A696A722A724A726A728A72AA72CA72EA732A734A736A738A73AA73CA73EA740A742A744A746A748A74AA74CA74EA750A752A754A756A758A75AA75CA75EA760A762A764A766A768A76AA76CA76EA779A77BA77DA77EA780A782A784A786A78BFF21-FF3A",
    Lt: "01C501C801CB01F21F88-1F8F1F98-1F9F1FA8-1FAF1FBC1FCC1FFC",
    Lm: "02B0-02C102C6-02D102E0-02E402EC02EE0374037A0559064006E506E607F407F507FA081A0824082809710E460EC610FC17D718431AA71C78-1C7D1D2C-1D611D781D9B-1DBF2071207F2090-20942C7D2D6F2E2F30053031-3035303B309D309E30FC-30FEA015A4F8-A4FDA60CA67FA717-A71FA770A788A9CFAA70AADDFF70FF9EFF9F",
    Lo: "01BB01C0-01C3029405D0-05EA05F0-05F20621-063F0641-064A066E066F0671-06D306D506EE06EF06FA-06FC06FF07100712-072F074D-07A507B107CA-07EA0800-08150904-0939093D09500958-096109720979-097F0985-098C098F09900993-09A809AA-09B009B209B6-09B909BD09CE09DC09DD09DF-09E109F009F10A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A59-0A5C0A5E0A72-0A740A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD0AD00AE00AE10B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D0B5C0B5D0B5F-0B610B710B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BD00C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D0C580C590C600C610C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD0CDE0CE00CE10D05-0D0C0D0E-0D100D12-0D280D2A-0D390D3D0D600D610D7A-0D7F0D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60E01-0E300E320E330E40-0E450E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB00EB20EB30EBD0EC0-0EC40EDC0EDD0F000F40-0F470F49-0F6C0F88-0F8B1000-102A103F1050-1055105A-105D106110651066106E-10701075-1081108E10D0-10FA1100-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA1700-170C170E-17111720-17311740-17511760-176C176E-17701780-17B317DC1820-18421844-18771880-18A818AA18B0-18F51900-191C1950-196D1970-19741980-19AB19C1-19C71A00-1A161A20-1A541B05-1B331B45-1B4B1B83-1BA01BAE1BAF1C00-1C231C4D-1C4F1C5A-1C771CE9-1CEC1CEE-1CF12135-21382D30-2D652D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE3006303C3041-3096309F30A1-30FA30FF3105-312D3131-318E31A0-31B731F0-31FF3400-4DB54E00-9FCBA000-A014A016-A48CA4D0-A4F7A500-A60BA610-A61FA62AA62BA66EA6A0-A6E5A7FB-A801A803-A805A807-A80AA80C-A822A840-A873A882-A8B3A8F2-A8F7A8FBA90A-A925A930-A946A960-A97CA984-A9B2AA00-AA28AA40-AA42AA44-AA4BAA60-AA6FAA71-AA76AA7AAA80-AAAFAAB1AAB5AAB6AAB9-AABDAAC0AAC2AADBAADCABC0-ABE2AC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA2DFA30-FA6DFA70-FAD9FB1DFB1F-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF66-FF6FFF71-FF9DFFA0-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",
    M:  "0300-036F0483-04890591-05BD05BF05C105C205C405C505C70610-061A064B-065E067006D6-06DC06DE-06E406E706E806EA-06ED07110730-074A07A6-07B007EB-07F30816-0819081B-08230825-08270829-082D0900-0903093C093E-094E0951-0955096209630981-098309BC09BE-09C409C709C809CB-09CD09D709E209E30A01-0A030A3C0A3E-0A420A470A480A4B-0A4D0A510A700A710A750A81-0A830ABC0ABE-0AC50AC7-0AC90ACB-0ACD0AE20AE30B01-0B030B3C0B3E-0B440B470B480B4B-0B4D0B560B570B620B630B820BBE-0BC20BC6-0BC80BCA-0BCD0BD70C01-0C030C3E-0C440C46-0C480C4A-0C4D0C550C560C620C630C820C830CBC0CBE-0CC40CC6-0CC80CCA-0CCD0CD50CD60CE20CE30D020D030D3E-0D440D46-0D480D4A-0D4D0D570D620D630D820D830DCA0DCF-0DD40DD60DD8-0DDF0DF20DF30E310E34-0E3A0E47-0E4E0EB10EB4-0EB90EBB0EBC0EC8-0ECD0F180F190F350F370F390F3E0F3F0F71-0F840F860F870F90-0F970F99-0FBC0FC6102B-103E1056-1059105E-10601062-10641067-106D1071-10741082-108D108F109A-109D135F1712-17141732-1734175217531772177317B6-17D317DD180B-180D18A91920-192B1930-193B19B0-19C019C819C91A17-1A1B1A55-1A5E1A60-1A7C1A7F1B00-1B041B34-1B441B6B-1B731B80-1B821BA1-1BAA1C24-1C371CD0-1CD21CD4-1CE81CED1CF21DC0-1DE61DFD-1DFF20D0-20F02CEF-2CF12DE0-2DFF302A-302F3099309AA66F-A672A67CA67DA6F0A6F1A802A806A80BA823-A827A880A881A8B4-A8C4A8E0-A8F1A926-A92DA947-A953A980-A983A9B3-A9C0AA29-AA36AA43AA4CAA4DAA7BAAB0AAB2-AAB4AAB7AAB8AABEAABFAAC1ABE3-ABEAABECABEDFB1EFE00-FE0FFE20-FE26",
    Mn: "0300-036F0483-04870591-05BD05BF05C105C205C405C505C70610-061A064B-065E067006D6-06DC06DF-06E406E706E806EA-06ED07110730-074A07A6-07B007EB-07F30816-0819081B-08230825-08270829-082D0900-0902093C0941-0948094D0951-095509620963098109BC09C1-09C409CD09E209E30A010A020A3C0A410A420A470A480A4B-0A4D0A510A700A710A750A810A820ABC0AC1-0AC50AC70AC80ACD0AE20AE30B010B3C0B3F0B41-0B440B4D0B560B620B630B820BC00BCD0C3E-0C400C46-0C480C4A-0C4D0C550C560C620C630CBC0CBF0CC60CCC0CCD0CE20CE30D41-0D440D4D0D620D630DCA0DD2-0DD40DD60E310E34-0E3A0E47-0E4E0EB10EB4-0EB90EBB0EBC0EC8-0ECD0F180F190F350F370F390F71-0F7E0F80-0F840F860F870F90-0F970F99-0FBC0FC6102D-10301032-10371039103A103D103E10581059105E-10601071-1074108210851086108D109D135F1712-17141732-1734175217531772177317B7-17BD17C617C9-17D317DD180B-180D18A91920-19221927192819321939-193B1A171A181A561A58-1A5E1A601A621A65-1A6C1A73-1A7C1A7F1B00-1B031B341B36-1B3A1B3C1B421B6B-1B731B801B811BA2-1BA51BA81BA91C2C-1C331C361C371CD0-1CD21CD4-1CE01CE2-1CE81CED1DC0-1DE61DFD-1DFF20D0-20DC20E120E5-20F02CEF-2CF12DE0-2DFF302A-302F3099309AA66FA67CA67DA6F0A6F1A802A806A80BA825A826A8C4A8E0-A8F1A926-A92DA947-A951A980-A982A9B3A9B6-A9B9A9BCAA29-AA2EAA31AA32AA35AA36AA43AA4CAAB0AAB2-AAB4AAB7AAB8AABEAABFAAC1ABE5ABE8ABEDFB1EFE00-FE0FFE20-FE26",
    Mc: "0903093E-09400949-094C094E0982098309BE-09C009C709C809CB09CC09D70A030A3E-0A400A830ABE-0AC00AC90ACB0ACC0B020B030B3E0B400B470B480B4B0B4C0B570BBE0BBF0BC10BC20BC6-0BC80BCA-0BCC0BD70C01-0C030C41-0C440C820C830CBE0CC0-0CC40CC70CC80CCA0CCB0CD50CD60D020D030D3E-0D400D46-0D480D4A-0D4C0D570D820D830DCF-0DD10DD8-0DDF0DF20DF30F3E0F3F0F7F102B102C10311038103B103C105610571062-10641067-106D108310841087-108C108F109A-109C17B617BE-17C517C717C81923-19261929-192B193019311933-193819B0-19C019C819C91A19-1A1B1A551A571A611A631A641A6D-1A721B041B351B3B1B3D-1B411B431B441B821BA11BA61BA71BAA1C24-1C2B1C341C351CE11CF2A823A824A827A880A881A8B4-A8C3A952A953A983A9B4A9B5A9BAA9BBA9BD-A9C0AA2FAA30AA33AA34AA4DAA7BABE3ABE4ABE6ABE7ABE9ABEAABEC",
    Me: "0488048906DE20DD-20E020E2-20E4A670-A672",
    N:  "0030-003900B200B300B900BC-00BE0660-066906F0-06F907C0-07C90966-096F09E6-09EF09F4-09F90A66-0A6F0AE6-0AEF0B66-0B6F0BE6-0BF20C66-0C6F0C78-0C7E0CE6-0CEF0D66-0D750E50-0E590ED0-0ED90F20-0F331040-10491090-10991369-137C16EE-16F017E0-17E917F0-17F91810-18191946-194F19D0-19DA1A80-1A891A90-1A991B50-1B591BB0-1BB91C40-1C491C50-1C5920702074-20792080-20892150-21822185-21892460-249B24EA-24FF2776-27932CFD30073021-30293038-303A3192-31953220-32293251-325F3280-328932B1-32BFA620-A629A6E6-A6EFA830-A835A8D0-A8D9A900-A909A9D0-A9D9AA50-AA59ABF0-ABF9FF10-FF19",
    Nd: "0030-00390660-066906F0-06F907C0-07C90966-096F09E6-09EF0A66-0A6F0AE6-0AEF0B66-0B6F0BE6-0BEF0C66-0C6F0CE6-0CEF0D66-0D6F0E50-0E590ED0-0ED90F20-0F291040-10491090-109917E0-17E91810-18191946-194F19D0-19DA1A80-1A891A90-1A991B50-1B591BB0-1BB91C40-1C491C50-1C59A620-A629A8D0-A8D9A900-A909A9D0-A9D9AA50-AA59ABF0-ABF9FF10-FF19",
    Nl: "16EE-16F02160-21822185-218830073021-30293038-303AA6E6-A6EF",
    No: "00B200B300B900BC-00BE09F4-09F90BF0-0BF20C78-0C7E0D70-0D750F2A-0F331369-137C17F0-17F920702074-20792080-20892150-215F21892460-249B24EA-24FF2776-27932CFD3192-31953220-32293251-325F3280-328932B1-32BFA830-A835",
    P:  "0021-00230025-002A002C-002F003A003B003F0040005B-005D005F007B007D00A100AB00B700BB00BF037E0387055A-055F0589058A05BE05C005C305C605F305F40609060A060C060D061B061E061F066A-066D06D40700-070D07F7-07F90830-083E0964096509700DF40E4F0E5A0E5B0F04-0F120F3A-0F3D0F850FD0-0FD4104A-104F10FB1361-13681400166D166E169B169C16EB-16ED1735173617D4-17D617D8-17DA1800-180A1944194519DE19DF1A1E1A1F1AA0-1AA61AA8-1AAD1B5A-1B601C3B-1C3F1C7E1C7F1CD32010-20272030-20432045-20512053-205E207D207E208D208E2329232A2768-277527C527C627E6-27EF2983-299829D8-29DB29FC29FD2CF9-2CFC2CFE2CFF2E00-2E2E2E302E313001-30033008-30113014-301F3030303D30A030FBA4FEA4FFA60D-A60FA673A67EA6F2-A6F7A874-A877A8CEA8CFA8F8-A8FAA92EA92FA95FA9C1-A9CDA9DEA9DFAA5C-AA5FAADEAADFABEBFD3EFD3FFE10-FE19FE30-FE52FE54-FE61FE63FE68FE6AFE6BFF01-FF03FF05-FF0AFF0C-FF0FFF1AFF1BFF1FFF20FF3B-FF3DFF3FFF5BFF5DFF5F-FF65",
    Pd: "002D058A05BE140018062010-20152E172E1A301C303030A0FE31FE32FE58FE63FF0D",
    Ps: "0028005B007B0F3A0F3C169B201A201E2045207D208D23292768276A276C276E27702772277427C527E627E827EA27EC27EE2983298529872989298B298D298F299129932995299729D829DA29FC2E222E242E262E283008300A300C300E3010301430163018301A301DFD3EFE17FE35FE37FE39FE3BFE3DFE3FFE41FE43FE47FE59FE5BFE5DFF08FF3BFF5BFF5FFF62",
    Pe: "0029005D007D0F3B0F3D169C2046207E208E232A2769276B276D276F27712773277527C627E727E927EB27ED27EF298429862988298A298C298E2990299229942996299829D929DB29FD2E232E252E272E293009300B300D300F3011301530173019301B301E301FFD3FFE18FE36FE38FE3AFE3CFE3EFE40FE42FE44FE48FE5AFE5CFE5EFF09FF3DFF5DFF60FF63",
    Pi: "00AB2018201B201C201F20392E022E042E092E0C2E1C2E20",
    Pf: "00BB2019201D203A2E032E052E0A2E0D2E1D2E21",
    Pc: "005F203F20402054FE33FE34FE4D-FE4FFF3F",
    Po: "0021-00230025-0027002A002C002E002F003A003B003F0040005C00A100B700BF037E0387055A-055F058905C005C305C605F305F40609060A060C060D061B061E061F066A-066D06D40700-070D07F7-07F90830-083E0964096509700DF40E4F0E5A0E5B0F04-0F120F850FD0-0FD4104A-104F10FB1361-1368166D166E16EB-16ED1735173617D4-17D617D8-17DA1800-18051807-180A1944194519DE19DF1A1E1A1F1AA0-1AA61AA8-1AAD1B5A-1B601C3B-1C3F1C7E1C7F1CD3201620172020-20272030-2038203B-203E2041-20432047-205120532055-205E2CF9-2CFC2CFE2CFF2E002E012E06-2E082E0B2E0E-2E162E182E192E1B2E1E2E1F2E2A-2E2E2E302E313001-3003303D30FBA4FEA4FFA60D-A60FA673A67EA6F2-A6F7A874-A877A8CEA8CFA8F8-A8FAA92EA92FA95FA9C1-A9CDA9DEA9DFAA5C-AA5FAADEAADFABEBFE10-FE16FE19FE30FE45FE46FE49-FE4CFE50-FE52FE54-FE57FE5F-FE61FE68FE6AFE6BFF01-FF03FF05-FF07FF0AFF0CFF0EFF0FFF1AFF1BFF1FFF20FF3CFF61FF64FF65",
    S:  "0024002B003C-003E005E0060007C007E00A2-00A900AC00AE-00B100B400B600B800D700F702C2-02C502D2-02DF02E5-02EB02ED02EF-02FF03750384038503F604820606-0608060B060E060F06E906FD06FE07F609F209F309FA09FB0AF10B700BF3-0BFA0C7F0CF10CF20D790E3F0F01-0F030F13-0F170F1A-0F1F0F340F360F380FBE-0FC50FC7-0FCC0FCE0FCF0FD5-0FD8109E109F13601390-139917DB194019E0-19FF1B61-1B6A1B74-1B7C1FBD1FBF-1FC11FCD-1FCF1FDD-1FDF1FED-1FEF1FFD1FFE20442052207A-207C208A-208C20A0-20B8210021012103-21062108210921142116-2118211E-2123212521272129212E213A213B2140-2144214A-214D214F2190-2328232B-23E82400-24262440-244A249C-24E92500-26CD26CF-26E126E326E8-26FF2701-27042706-2709270C-27272729-274B274D274F-27522756-275E2761-276727942798-27AF27B1-27BE27C0-27C427C7-27CA27CC27D0-27E527F0-29822999-29D729DC-29FB29FE-2B4C2B50-2B592CE5-2CEA2E80-2E992E9B-2EF32F00-2FD52FF0-2FFB300430123013302030363037303E303F309B309C319031913196-319F31C0-31E33200-321E322A-32503260-327F328A-32B032C0-32FE3300-33FF4DC0-4DFFA490-A4C6A700-A716A720A721A789A78AA828-A82BA836-A839AA77-AA79FB29FDFCFDFDFE62FE64-FE66FE69FF04FF0BFF1C-FF1EFF3EFF40FF5CFF5EFFE0-FFE6FFE8-FFEEFFFCFFFD",
    Sm: "002B003C-003E007C007E00AC00B100D700F703F60606-060820442052207A-207C208A-208C2140-2144214B2190-2194219A219B21A021A321A621AE21CE21CF21D221D421F4-22FF2308-230B23202321237C239B-23B323DC-23E125B725C125F8-25FF266F27C0-27C427C7-27CA27CC27D0-27E527F0-27FF2900-29822999-29D729DC-29FB29FE-2AFF2B30-2B442B47-2B4CFB29FE62FE64-FE66FF0BFF1C-FF1EFF5CFF5EFFE2FFE9-FFEC",
    Sc: "002400A2-00A5060B09F209F309FB0AF10BF90E3F17DB20A0-20B8A838FDFCFE69FF04FFE0FFE1FFE5FFE6",
    Sk: "005E006000A800AF00B400B802C2-02C502D2-02DF02E5-02EB02ED02EF-02FF0375038403851FBD1FBF-1FC11FCD-1FCF1FDD-1FDF1FED-1FEF1FFD1FFE309B309CA700-A716A720A721A789A78AFF3EFF40FFE3",
    So: "00A600A700A900AE00B000B60482060E060F06E906FD06FE07F609FA0B700BF3-0BF80BFA0C7F0CF10CF20D790F01-0F030F13-0F170F1A-0F1F0F340F360F380FBE-0FC50FC7-0FCC0FCE0FCF0FD5-0FD8109E109F13601390-1399194019E0-19FF1B61-1B6A1B74-1B7C210021012103-21062108210921142116-2118211E-2123212521272129212E213A213B214A214C214D214F2195-2199219C-219F21A121A221A421A521A7-21AD21AF-21CD21D021D121D321D5-21F32300-2307230C-231F2322-2328232B-237B237D-239A23B4-23DB23E2-23E82400-24262440-244A249C-24E92500-25B625B8-25C025C2-25F72600-266E2670-26CD26CF-26E126E326E8-26FF2701-27042706-2709270C-27272729-274B274D274F-27522756-275E2761-276727942798-27AF27B1-27BE2800-28FF2B00-2B2F2B452B462B50-2B592CE5-2CEA2E80-2E992E9B-2EF32F00-2FD52FF0-2FFB300430123013302030363037303E303F319031913196-319F31C0-31E33200-321E322A-32503260-327F328A-32B032C0-32FE3300-33FF4DC0-4DFFA490-A4C6A828-A82BA836A837A839AA77-AA79FDFDFFE4FFE8FFEDFFEEFFFCFFFD",
    Z:  "002000A01680180E2000-200A20282029202F205F3000",
    Zs: "002000A01680180E2000-200A202F205F3000",
    Zl: "2028",
    Zp: "2029",
    C:  "0000-001F007F-009F00AD03780379037F-0383038B038D03A20526-05300557055805600588058B-059005C8-05CF05EB-05EF05F5-0605061C061D0620065F06DD070E070F074B074C07B2-07BF07FB-07FF082E082F083F-08FF093A093B094F095609570973-097809800984098D098E0991099209A909B109B3-09B509BA09BB09C509C609C909CA09CF-09D609D8-09DB09DE09E409E509FC-0A000A040A0B-0A0E0A110A120A290A310A340A370A3A0A3B0A3D0A43-0A460A490A4A0A4E-0A500A52-0A580A5D0A5F-0A650A76-0A800A840A8E0A920AA90AB10AB40ABA0ABB0AC60ACA0ACE0ACF0AD1-0ADF0AE40AE50AF00AF2-0B000B040B0D0B0E0B110B120B290B310B340B3A0B3B0B450B460B490B4A0B4E-0B550B58-0B5B0B5E0B640B650B72-0B810B840B8B-0B8D0B910B96-0B980B9B0B9D0BA0-0BA20BA5-0BA70BAB-0BAD0BBA-0BBD0BC3-0BC50BC90BCE0BCF0BD1-0BD60BD8-0BE50BFB-0C000C040C0D0C110C290C340C3A-0C3C0C450C490C4E-0C540C570C5A-0C5F0C640C650C70-0C770C800C810C840C8D0C910CA90CB40CBA0CBB0CC50CC90CCE-0CD40CD7-0CDD0CDF0CE40CE50CF00CF3-0D010D040D0D0D110D290D3A-0D3C0D450D490D4E-0D560D58-0D5F0D640D650D76-0D780D800D810D840D97-0D990DB20DBC0DBE0DBF0DC7-0DC90DCB-0DCE0DD50DD70DE0-0DF10DF5-0E000E3B-0E3E0E5C-0E800E830E850E860E890E8B0E8C0E8E-0E930E980EA00EA40EA60EA80EA90EAC0EBA0EBE0EBF0EC50EC70ECE0ECF0EDA0EDB0EDE-0EFF0F480F6D-0F700F8C-0F8F0F980FBD0FCD0FD9-0FFF10C6-10CF10FD-10FF1249124E124F12571259125E125F1289128E128F12B112B612B712BF12C112C612C712D7131113161317135B-135E137D-137F139A-139F13F5-13FF169D-169F16F1-16FF170D1715-171F1737-173F1754-175F176D17711774-177F17B417B517DE17DF17EA-17EF17FA-17FF180F181A-181F1878-187F18AB-18AF18F6-18FF191D-191F192C-192F193C-193F1941-1943196E196F1975-197F19AC-19AF19CA-19CF19DB-19DD1A1C1A1D1A5F1A7D1A7E1A8A-1A8F1A9A-1A9F1AAE-1AFF1B4C-1B4F1B7D-1B7F1BAB-1BAD1BBA-1BFF1C38-1C3A1C4A-1C4C1C80-1CCF1CF3-1CFF1DE7-1DFC1F161F171F1E1F1F1F461F471F4E1F4F1F581F5A1F5C1F5E1F7E1F7F1FB51FC51FD41FD51FDC1FF01FF11FF51FFF200B-200F202A-202E2060-206F20722073208F2095-209F20B9-20CF20F1-20FF218A-218F23E9-23FF2427-243F244B-245F26CE26E226E4-26E727002705270A270B2728274C274E2753-2755275F27602795-279727B027BF27CB27CD-27CF2B4D-2B4F2B5A-2BFF2C2F2C5F2CF2-2CF82D26-2D2F2D66-2D6E2D70-2D7F2D97-2D9F2DA72DAF2DB72DBF2DC72DCF2DD72DDF2E32-2E7F2E9A2EF4-2EFF2FD6-2FEF2FFC-2FFF3040309730983100-3104312E-3130318F31B8-31BF31E4-31EF321F32FF4DB6-4DBF9FCC-9FFFA48D-A48FA4C7-A4CFA62C-A63FA660A661A674-A67BA698-A69FA6F8-A6FFA78D-A7FAA82C-A82FA83A-A83FA878-A87FA8C5-A8CDA8DA-A8DFA8FC-A8FFA954-A95EA97D-A97FA9CEA9DA-A9DDA9E0-A9FFAA37-AA3FAA4EAA4FAA5AAA5BAA7C-AA7FAAC3-AADAAAE0-ABBFABEEABEFABFA-ABFFD7A4-D7AFD7C7-D7CAD7FC-F8FFFA2EFA2FFA6EFA6FFADA-FAFFFB07-FB12FB18-FB1CFB37FB3DFB3FFB42FB45FBB2-FBD2FD40-FD4FFD90FD91FDC8-FDEFFDFEFDFFFE1A-FE1FFE27-FE2FFE53FE67FE6C-FE6FFE75FEFD-FF00FFBF-FFC1FFC8FFC9FFD0FFD1FFD8FFD9FFDD-FFDFFFE7FFEF-FFFBFFFEFFFF",
    Cc: "0000-001F007F-009F",
    Cf: "00AD0600-060306DD070F17B417B5200B-200F202A-202E2060-2064206A-206FFEFFFFF9-FFFB",
    Co: "E000-F8FF",
    Cs: "D800-DFFF",
    Cn: "03780379037F-0383038B038D03A20526-05300557055805600588058B-059005C8-05CF05EB-05EF05F5-05FF06040605061C061D0620065F070E074B074C07B2-07BF07FB-07FF082E082F083F-08FF093A093B094F095609570973-097809800984098D098E0991099209A909B109B3-09B509BA09BB09C509C609C909CA09CF-09D609D8-09DB09DE09E409E509FC-0A000A040A0B-0A0E0A110A120A290A310A340A370A3A0A3B0A3D0A43-0A460A490A4A0A4E-0A500A52-0A580A5D0A5F-0A650A76-0A800A840A8E0A920AA90AB10AB40ABA0ABB0AC60ACA0ACE0ACF0AD1-0ADF0AE40AE50AF00AF2-0B000B040B0D0B0E0B110B120B290B310B340B3A0B3B0B450B460B490B4A0B4E-0B550B58-0B5B0B5E0B640B650B72-0B810B840B8B-0B8D0B910B96-0B980B9B0B9D0BA0-0BA20BA5-0BA70BAB-0BAD0BBA-0BBD0BC3-0BC50BC90BCE0BCF0BD1-0BD60BD8-0BE50BFB-0C000C040C0D0C110C290C340C3A-0C3C0C450C490C4E-0C540C570C5A-0C5F0C640C650C70-0C770C800C810C840C8D0C910CA90CB40CBA0CBB0CC50CC90CCE-0CD40CD7-0CDD0CDF0CE40CE50CF00CF3-0D010D040D0D0D110D290D3A-0D3C0D450D490D4E-0D560D58-0D5F0D640D650D76-0D780D800D810D840D97-0D990DB20DBC0DBE0DBF0DC7-0DC90DCB-0DCE0DD50DD70DE0-0DF10DF5-0E000E3B-0E3E0E5C-0E800E830E850E860E890E8B0E8C0E8E-0E930E980EA00EA40EA60EA80EA90EAC0EBA0EBE0EBF0EC50EC70ECE0ECF0EDA0EDB0EDE-0EFF0F480F6D-0F700F8C-0F8F0F980FBD0FCD0FD9-0FFF10C6-10CF10FD-10FF1249124E124F12571259125E125F1289128E128F12B112B612B712BF12C112C612C712D7131113161317135B-135E137D-137F139A-139F13F5-13FF169D-169F16F1-16FF170D1715-171F1737-173F1754-175F176D17711774-177F17DE17DF17EA-17EF17FA-17FF180F181A-181F1878-187F18AB-18AF18F6-18FF191D-191F192C-192F193C-193F1941-1943196E196F1975-197F19AC-19AF19CA-19CF19DB-19DD1A1C1A1D1A5F1A7D1A7E1A8A-1A8F1A9A-1A9F1AAE-1AFF1B4C-1B4F1B7D-1B7F1BAB-1BAD1BBA-1BFF1C38-1C3A1C4A-1C4C1C80-1CCF1CF3-1CFF1DE7-1DFC1F161F171F1E1F1F1F461F471F4E1F4F1F581F5A1F5C1F5E1F7E1F7F1FB51FC51FD41FD51FDC1FF01FF11FF51FFF2065-206920722073208F2095-209F20B9-20CF20F1-20FF218A-218F23E9-23FF2427-243F244B-245F26CE26E226E4-26E727002705270A270B2728274C274E2753-2755275F27602795-279727B027BF27CB27CD-27CF2B4D-2B4F2B5A-2BFF2C2F2C5F2CF2-2CF82D26-2D2F2D66-2D6E2D70-2D7F2D97-2D9F2DA72DAF2DB72DBF2DC72DCF2DD72DDF2E32-2E7F2E9A2EF4-2EFF2FD6-2FEF2FFC-2FFF3040309730983100-3104312E-3130318F31B8-31BF31E4-31EF321F32FF4DB6-4DBF9FCC-9FFFA48D-A48FA4C7-A4CFA62C-A63FA660A661A674-A67BA698-A69FA6F8-A6FFA78D-A7FAA82C-A82FA83A-A83FA878-A87FA8C5-A8CDA8DA-A8DFA8FC-A8FFA954-A95EA97D-A97FA9CEA9DA-A9DDA9E0-A9FFAA37-AA3FAA4EAA4FAA5AAA5BAA7C-AA7FAAC3-AADAAAE0-ABBFABEEABEFABFA-ABFFD7A4-D7AFD7C7-D7CAD7FC-D7FFFA2EFA2FFA6EFA6FFADA-FAFFFB07-FB12FB18-FB1CFB37FB3DFB3FFB42FB45FBB2-FBD2FD40-FD4FFD90FD91FDC8-FDEFFDFEFDFFFE1A-FE1FFE27-FE2FFE53FE67FE6C-FE6FFE75FEFDFEFEFF00FFBF-FFC1FFC8FFC9FFD0FFD1FFD8FFD9FFDD-FFDFFFE7FFEF-FFF8FFFEFFFF"
});

function addUnicodePackage (pack) {
    var codePoint = /\w{4}/g;
    for (var name in pack)
        exports.packages[name] = pack[name].replace(codePoint, "\\u$&");
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

ace.define('ace/document', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/lib/event_emitter', 'ace/range', 'ace/anchor'], function(require, exports, module) {
"use strict";

var oop = require("./lib/oop");
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var Range = require("./range").Range;
var Anchor = require("./anchor").Anchor;

/**
 * class Document
 *
 * Contains the text of the document. Documents are controlled by a single [[EditSession `EditSession`]]. At its core, `Document`s are just an array of strings, with each row in the document matching up to the array index.
 *
 *
 **/

 /**
 * new Document([text])
 * - text (String | Array): The starting text
 *
 * Creates a new `Document`. If `text` is included, the `Document` contains those strings; otherwise, it's empty.
 *
 **/
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

    /**
    * Document.setValue(text) -> Void
    * - text (String): The text to use
    *
    * Replaces all the lines in the current `Document` with the value of `text`.
    **/
    this.setValue = function(text) {
        var len = this.getLength();
        this.remove(new Range(0, 0, len, this.getLine(len-1).length));
        this.insert({row: 0, column:0}, text);
    };

    /**
    * Document.getValue() -> String
    * 
    * Returns all the lines in the document as a single string, split by the new line character.
    **/
    this.getValue = function() {
        return this.getAllLines().join(this.getNewLineCharacter());
    };

    /** 
    * Document.createAnchor(row, column) -> Anchor
    * - row (Number): The row number to use
    * - column (Number): The column number to use
    *
    * Creates a new `Anchor` to define a floating point in the document.
    **/
    this.createAnchor = function(row, column) {
        return new Anchor(this, row, column);
    };

    /** internal, hide
    * Document.$split(text) -> [String]
    * - text (String): The text to work with
    * + ([String]): A String array, with each index containing a piece of the original `text` string.
    * 
    * Splits a string of text on any newline (`\n`) or carriage-return ('\r') characters.
    *
    *
    **/

    // check for IE split bug
    if ("aaa".split(/a/).length == 0)
        this.$split = function(text) {
            return text.replace(/\r\n|\r/g, "\n").split("\n");
        }
    else
        this.$split = function(text) {
            return text.split(/\r\n|\r|\n/);
        };


    /** internal, hide
    * Document.$detectNewLine(text) -> Void
    * 
    * 
    **/
    this.$detectNewLine = function(text) {
        var match = text.match(/^.*?(\r\n|\r|\n)/m);
        if (match) {
            this.$autoNewLine = match[1];
        } else {
            this.$autoNewLine = "\n";
        }
    };

    /**
    * Document.getNewLineCharacter() -> String
    * + (String): If `newLineMode == windows`, `\r\n` is returned.<br/>
    *  If `newLineMode == unix`, `\n` is returned.<br/>
    *  If `newLineMode == auto`, the value of `autoNewLine` is returned.
    * 
    * Returns the newline character that's being used, depending on the value of `newLineMode`. 
    *
    * 
    * 
    **/
    this.getNewLineCharacter = function() {
      switch (this.$newLineMode) {
          case "windows":
              return "\r\n";

          case "unix":
              return "\n";

          case "auto":
              return this.$autoNewLine;
      }
    };

    this.$autoNewLine = "\n";
    this.$newLineMode = "auto";
    /**
     * Document.setNewLineMode(newLineMode) -> Void
     * - newLineMode(String): [The newline mode to use; can be either `windows`, `unix`, or `auto`]{: #Document.setNewLineMode.param}
     * 
     * [Sets the new line mode.]{: #Document.setNewLineMode.desc}
     **/
    this.setNewLineMode = function(newLineMode) {
        if (this.$newLineMode === newLineMode)
            return;

        this.$newLineMode = newLineMode;
    };

    /**
    * Document.getNewLineMode() -> String
    * 
    * [Returns the type of newlines being used; either `windows`, `unix`, or `auto`]{: #Document.getNewLineMode}
    *
    **/
    this.getNewLineMode = function() {
        return this.$newLineMode;
    };

    /**
    * Document.isNewLine(text) -> Boolean
    * - text (String): The text to check
    *
    * Returns `true` if `text` is a newline character (either `\r\n`, `\r`, or `\n`).
    *
    **/
    this.isNewLine = function(text) {
        return (text == "\r\n" || text == "\r" || text == "\n");
    };

    /**
    * Document.getLine(row) -> String
    * - row (Number): The row index to retrieve
    * 
    * Returns a verbatim copy of the given line as it is in the document
    *
    **/
    this.getLine = function(row) {
        return this.$lines[row] || "";
    };

    /**
    * Document.getLines(firstRow, lastRow) -> [String]
    * - firstRow (Number): The first row index to retrieve
    * - lastRow (Number): The final row index to retrieve
    * 
    * Returns an array of strings of the rows between `firstRow` and `lastRow`. This function is inclusive of `lastRow`.
    *
    **/
    this.getLines = function(firstRow, lastRow) {
        return this.$lines.slice(firstRow, lastRow + 1);
    };

    /**
    * Document.getAllLines() -> [String]
    * 
    * Returns all lines in the document as string array. Warning: The caller should not modify this array!
    **/
    this.getAllLines = function() {
        return this.getLines(0, this.getLength());
    };

    /**
    * Document.getLength() -> Number
    * 
    * Returns the number of rows in the document.
    **/
    this.getLength = function() {
        return this.$lines.length;
    };

    /**
    * Document.getTextRange(range) -> String
    * - range (Range): The range to work with
    * 
    * [Given a range within the document, this function returns all the text within that range as a single string.]{: #Document.getTextRange.desc}
    **/
    this.getTextRange = function(range) {
        if (range.start.row == range.end.row) {
            return this.$lines[range.start.row].substring(range.start.column,
                                                         range.end.column);
        }
        else {
            var lines = this.getLines(range.start.row+1, range.end.row-1);
            lines.unshift((this.$lines[range.start.row] || "").substring(range.start.column));
            lines.push((this.$lines[range.end.row] || "").substring(0, range.end.column));
            return lines.join(this.getNewLineCharacter());
        }
    };

    /** internal, hide
    * Document.$clipPosition(position) -> Number
    * 
    * 
    **/
    this.$clipPosition = function(position) {
        var length = this.getLength();
        if (position.row >= length) {
            position.row = Math.max(0, length - 1);
            position.column = this.getLine(length-1).length;
        }
        return position;
    };

    /**
    * Document.insert(position, text) -> Number
    * - position (Number): The position to start inserting at 
    * - text (String): A chunk of text to insert
    * + (Number): The position of the last line of `text`. If the length of `text` is 0, this function simply returns `position`. 
    * Inserts a block of `text` and the indicated `position`.
    *
    * 
    **/
    this.insert = function(position, text) {
        if (!text || text.length === 0)
            return position;

        position = this.$clipPosition(position);

        // only detect new lines if the document has no line break yet
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

    /**
    * Document.insertLines(row, lines) -> Object
    * - row (Number): The index of the row to insert at
    * - lines (Array): An array of strings
    * + (Object): Returns an object containing the final row and column, like this:<br/>
    *   ```{row: endRow, column: 0}```<br/>
    *   If `lines` is empty, this function returns an object containing the current row, and column, like this:<br/>
    *   ```{row: row, column: 0}```
    *
    * Inserts the elements in `lines` into the document, starting at the row index given by `row`. This method also triggers the `'change'` event.
    *
    *
    **/
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
        this._emit("change", { data: delta });
        return range.end;
    };

    /**
    * Document.insertNewLine(position) -> Object
    * - position (String): The position to insert at
    * + (Object): Returns an object containing the final row and column, like this:<br/>
    *    ```{row: endRow, column: 0}```
    * 
    * Inserts a new line into the document at the current row's `position`. This method also triggers the `'change'` event. 
    *
    *   
    *
    **/
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
        this._emit("change", { data: delta });

        return end;
    };

    /**
    * Document.insertInLine(position, text) -> Object | Number
    * - position (Number): The position to insert at
    * - text (String): A chunk of text
    * + (Object): Returns an object containing the final row and column, like this:<br/>
    *     ```{row: endRow, column: 0}```
    * + (Number): If `text` is empty, this function returns the value of `position`
    * 
    * Inserts `text` into the `position` at the current row. This method also triggers the `'change'` event.
    *
    *
    *
    **/
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
        this._emit("change", { data: delta });

        return end;
    };

    /**
    * Document.remove(range) -> Object
    * - range (Range): A specified Range to remove
    * + (Object): Returns the new `start` property of the range, which contains `startRow` and `startColumn`. If `range` is empty, this function returns the unmodified value of `range.start`.
    * 
    * Removes the `range` from the document.
    *
    *
    **/
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

    /**
    * Document.removeInLine(row, startColumn, endColumn) -> Object
    * - row (Number): The row to remove from
    * - startColumn (Number): The column to start removing at 
    * - endColumn (Number): The column to stop removing at
    * + (Object): Returns an object containing `startRow` and `startColumn`, indicating the new row and column values.<br/>If `startColumn` is equal to `endColumn`, this function returns nothing.
    *
    * Removes the specified columns from the `row`. This method also triggers the `'change'` event.
    *
    * 
    **/
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
        this._emit("change", { data: delta });
        return range.start;
    };

    /**
    * Document.removeLines(firstRow, lastRow) -> [String]
    * - firstRow (Number): The first row to be removed
    * - lastRow (Number): The last row to be removed
    * + ([String]): Returns all the removed lines.
    * 
    * Removes a range of full lines. This method also triggers the `'change'` event.
    * 
    *
    **/
    this.removeLines = function(firstRow, lastRow) {
        var range = new Range(firstRow, 0, lastRow + 1, 0);
        var removed = this.$lines.splice(firstRow, lastRow - firstRow + 1);

        var delta = {
            action: "removeLines",
            range: range,
            nl: this.getNewLineCharacter(),
            lines: removed
        };
        this._emit("change", { data: delta });
        return removed;
    };

    /**
    * Document.removeNewLine(row) -> Void
    * - row (Number): The row to check
    * 
    * Removes the new line between `row` and the row immediately following it. This method also triggers the `'change'` event.
    *
    **/
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
        this._emit("change", { data: delta });
    };

    /**
    * Document.replace(range, text) -> Object
    * - range (Range): A specified Range to replace
    * - text (String): The new text to use as a replacement
    * + (Object): Returns an object containing the final row and column, like this:
    *     {row: endRow, column: 0}
    * If the text and range are empty, this function returns an object containing the current `range.start` value.
    * If the text is the exact same as what currently exists, this function returns an object containing the current `range.end` value.
    *
    * Replaces a range in the document with the new `text`.
    *
    **/
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

    /**
    * Document.applyDeltas(deltas) -> Void
    * 
    * Applies all the changes previously accumulated. These can be either `'includeText'`, `'insertLines'`, `'removeText'`, and `'removeLines'`.
    **/
    this.applyDeltas = function(deltas) {
        for (var i=0; i<deltas.length; i++) {
            var delta = deltas[i];
            var range = Range.fromPoints(delta.range.start, delta.range.end);

            if (delta.action == "insertLines")
                this.insertLines(range.start.row, delta.lines);
            else if (delta.action == "insertText")
                this.insert(range.start, delta.text);
            else if (delta.action == "removeLines")
                this.removeLines(range.start.row, range.end.row - 1);
            else if (delta.action == "removeText")
                this.remove(range);
        }
    };

    /**
    * Document.revertDeltas(deltas) -> Void
    * 
    * Reverts any changes previously applied. These can be either `'includeText'`, `'insertLines'`, `'removeText'`, and `'removeLines'`.
    **/
    this.revertDeltas = function(deltas) {
        for (var i=deltas.length-1; i>=0; i--) {
            var delta = deltas[i];

            var range = Range.fromPoints(delta.range.start, delta.range.end);

            if (delta.action == "insertLines")
                this.removeLines(range.start.row, range.end.row - 1);
            else if (delta.action == "insertText")
                this.remove(range);
            else if (delta.action == "removeLines")
                this.insertLines(range.start.row, delta.lines);
            else if (delta.action == "removeText")
                this.insert(range.start, delta.text);
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

ace.define('ace/anchor', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/lib/event_emitter'], function(require, exports, module) {
"use strict";

var oop = require("./lib/oop");
var EventEmitter = require("./lib/event_emitter").EventEmitter;

/**
 * class Anchor
 *
 * Defines the floating pointer in the document. Whenever text is inserted or deleted before the cursor, the position of the cursor is updated
 *
 **/

/**
 * new Anchor(doc, row, column)
 * - doc (Document): The document to associate with the anchor
 * - row (Number): The starting row position
 * - column (Number): The starting column position
 *
 * Creates a new `Anchor` and associates it with a document.
 *
 **/

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
    
    /**
     * Anchor.getPosition() -> Object
     *
     * Returns an object identifying the `row` and `column` position of the current anchor.
     *
     **/

    this.getPosition = function() {
        return this.$clipPositionToDocument(this.row, this.column);
    };
 
     /**
     * Anchor.getDocument() -> Document
     *
     * Returns the current document.
     *
     **/
        
    this.getDocument = function() {
        return this.document;
    };
    
     /**
     * Anchor@onChange(e)
     * - e (Event): Contains data about the event
     *
     * Fires whenever the anchor position changes. Events that can trigger this function include `'includeText'`, `'insertLines'`, `'removeText'`, and `'removeLines'`.
     *
     **/

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

     /**
     * Anchor.setPosition(row, column, noClip)
     * - row (Number): The row index to move the anchor to
     * - column (Number): The column index to move the anchor to
     * - noClip (Boolean): Identifies if you want the position to be clipped
     *
     * Sets the anchor position to the specified row and column. If `noClip` is `true`, the position is not clipped.
     *
     **/

    this.setPosition = function(row, column, noClip) {
        var pos;
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
        this._emit("change", {
            old: old,
            value: pos
        });
    };
    
    /**
     * Anchor.detach()
     *
     * When called, the `'change'` event listener is removed.
     *
     **/

    this.detach = function() {
        this.document.removeEventListener("change", this.$onChange);
    };
    
    /** internal, hide
     * Anchor.clipPositionToDocument(row, column)
     * - row (Number): The row index to clip the anchor to
     * - column (Number): The column index to clip the anchor to
     *
     * Clips the anchor position to the specified row and column.
     *
     **/

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

ace.define('ace/background_tokenizer', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/lib/event_emitter'], function(require, exports, module) {
"use strict";

var oop = require("./lib/oop");
var EventEmitter = require("./lib/event_emitter").EventEmitter;

/**
 * class BackgroundTokenizer
 *
 * Tokenizes the current [[Document `Document`]] in the background, and caches the tokenized rows for future use. If a certain row is changed, everything below that row is re-tokenized.
 *
 **/

/**
 * new BackgroundTokenizer(tokenizer, editor)
 * - tokenizer (Tokenizer): The tokenizer to use
 * - editor (Editor): The editor to associate with
 *
 * Creates a new `BackgroundTokenizer` object.
 *
 *
 **/

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

        var len = doc.getLength();
        while (self.currentLine < len) {
            self.lines[self.currentLine] = self.$tokenizeRows(self.currentLine, self.currentLine)[0];
            self.currentLine++;

            // only check every 5 lines
            processedLines += 1;
            if ((processedLines % 5 == 0) && (new Date() - workerStart) > 20) {
                self.fireUpdateEvent(startLine, self.currentLine-1);
                self.running = setTimeout(self.$worker, 20);
                return;
            }
        }

        self.running = false;

        self.fireUpdateEvent(startLine, len - 1);
    };
};

(function(){

    oop.implement(this, EventEmitter);

    /**
     * BackgroundTokenizer.setTokenizer(tokenizer)
     * - tokenizer (Tokenizer): The new tokenizer to use
     *
     * Sets a new tokenizer for this object.
     *
     **/

    this.setTokenizer = function(tokenizer) {
        this.tokenizer = tokenizer;
        this.lines = [];

        this.start(0);
    };

    /**
     * BackgroundTokenizer.setDocument(doc)
     * - doc (Document): The new document to associate with
     *
     * Sets a new document to associate with this object.
     *
     **/

    this.setDocument = function(doc) {
        this.doc = doc;
        this.lines = [];

        this.stop();
    };

    /**
     * BackgroundTokenizer.fireUpdateEvent(firstRow, lastRow)
     * - firstRow (Number): The starting row region
     * - lastRow (Number): The final row region
     *
     * Emits the `'update'` event. `firstRow` and `lastRow` are used to define the boundaries of the region to be updated.
     *
     **/

    this.fireUpdateEvent = function(firstRow, lastRow) {
        var data = {
            first: firstRow,
            last: lastRow
        };
        this._emit("update", {data: data});
    };

    /**
     * BackgroundTokenizer.start(startRow)
     * - startRow (Number): The row to start at
     *
     * Starts tokenizing at the row indicated.
     *
     **/

    this.start = function(startRow) {
        this.currentLine = Math.min(startRow || 0, this.currentLine,
                                    this.doc.getLength());

        // remove all cached items below this line
        this.lines.splice(this.currentLine, this.lines.length);

        this.stop();
        // pretty long delay to prevent the tokenizer from interfering with the user
        this.running = setTimeout(this.$worker, 700);
    };

    /**
     * BackgroundTokenizer.stop()
     *
     * Stops tokenizing.
     *
     **/

    this.stop = function() {
        if (this.running)
            clearTimeout(this.running);
        this.running = false;
    };

    /** related to: BackgroundTokenizer.$tokenizeRows
     * BackgroundTokenizer.getTokens(firstRow, lastRow) -> [Object]
     * - firstRow (Number): The row to start at
     * - lastRow (Number): The row to finish at
     *
     * Starts tokenizing at the row indicated. Returns a list of objects of the tokenized rows.
     *
     **/

    this.getTokens = function(firstRow, lastRow) {
        return this.$tokenizeRows(firstRow, lastRow);
    };

    /** 
     * BackgroundTokenizer.getState(row) -> String
     * - row (Number): The row to start at
     *
     * [Returns the state of tokenization for a row.]{: #BackgroundTokenizer.getState}
     *
     **/

    this.getState = function(row) {
        return this.$tokenizeRows(row, row)[0].state;
    };

    /**
     * BackgroundTokenizer.$tokenizeRows(firstRow, lastRow) -> [Object]
     * - startRow (Number): The row to start at
     * - lastRow (Number): The row to finish at
     * + ([Object]): A list of the tokenized rows. Each item in the list is an object with two properties, `state` and `start`.
     *
     * Tokenizes all the rows within the specified region. 
     *
     *
     **/
    this.$tokenizeRows = function(firstRow, lastRow) {
        if (!this.doc || isNaN(firstRow) || isNaN(lastRow))
            return [{'state':'start','tokens':[]}];
            
        var rows = [];

        // determine start state
        var state = "start";
        var doCache = false;
        if (firstRow > 0 && this.lines[firstRow - 1]) {
            state = this.lines[firstRow - 1].state;
            doCache = true;
        } else if (firstRow == 0) {
            state = "start";
            doCache = true;
        } else if (this.lines.length > 0) {
            // Guess that we haven't changed state.
            state = this.lines[this.lines.length-1].state;
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
 *      Julian Viereck <julian DOT viereck AT gmail DOT com>
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

ace.define('ace/edit_session/folding', ['require', 'exports', 'module' , 'ace/range', 'ace/edit_session/fold_line', 'ace/edit_session/fold', 'ace/token_iterator'], function(require, exports, module) {
"use strict";

var Range = require("../range").Range;
var FoldLine = require("./fold_line").FoldLine;
var Fold = require("./fold").Fold;
var TokenIterator = require("../token_iterator").TokenIterator;

function Folding() {
    /*
     * Looks up a fold at a given row/column. Possible values for side:
     *   -1: ignore a fold if fold.start = row/column
     *   +1: ignore a fold if fold.end = row/column
     */
    this.getFoldAt = function(row, column, side) {
        var foldLine = this.getFoldLine(row);
        if (!foldLine)
            return null;

        var folds = foldLine.folds;
        for (var i = 0; i < folds.length; i++) {
            var fold = folds[i];
            if (fold.range.contains(row, column)) {
                if (side == 1 && fold.range.isEnd(row, column)) {
                    continue;
                } else if (side == -1 && fold.range.isStart(row, column)) {
                    continue;
                }
                return fold;
            }
        }
    };

    /*
     * Returns all folds in the given range. Note, that this will return folds
     *
     */
    this.getFoldsInRange = function(range) {
        range = range.clone();
        var start = range.start;
        var end = range.end;
        var foldLines = this.$foldData;
        var foundFolds = [];

        start.column += 1;
        end.column -= 1;

        for (var i = 0; i < foldLines.length; i++) {
            var cmp = foldLines[i].range.compareRange(range);
            if (cmp == 2) {
                // Range is before foldLine. No intersection. This means,
                // there might be other foldLines that intersect.
                continue;
            }
            else if (cmp == -2) {
                // Range is after foldLine. There can't be any other foldLines then,
                // so let's give up.
                break;
            }

            var folds = foldLines[i].folds;
            for (var j = 0; j < folds.length; j++) {
                var fold = folds[j];
                cmp = fold.range.compareRange(range);
                if (cmp == -2) {
                    break;
                } else if (cmp == 2) {
                    continue;
                } else
                // WTF-state: Can happen due to -1/+1 to start/end column.
                if (cmp == 42) {
                    break;
                }
                foundFolds.push(fold);
            }
        }
        return foundFolds;
    };
    
    /*
     * Returns all folds in the document
     */
    this.getAllFolds = function() {
        var folds = [];
        var foldLines = this.$foldData;
        
        function addFold(fold) {
            folds.push(fold);
            if (!fold.subFolds)
                return;
                
            for (var i = 0; i < fold.subFolds.length; i++)
                addFold(fold.subFolds[i]);
        }
        
        for (var i = 0; i < foldLines.length; i++)
            for (var j = 0; j < foldLines[i].folds.length; j++)
                addFold(foldLines[i].folds[j]);

        return folds;
    };

    /*
     * Returns the string between folds at the given position.
     * E.g.
     *  foo<fold>b|ar<fold>wolrd -> "bar"
     *  foo<fold>bar<fold>wol|rd -> "world"
     *  foo<fold>bar<fo|ld>wolrd -> <null>
     *
     * where | means the position of row/column
     *
     * The trim option determs if the return string should be trimed according
     * to the "side" passed with the trim value:
     *
     * E.g.
     *  foo<fold>b|ar<fold>wolrd -trim=-1> "b"
     *  foo<fold>bar<fold>wol|rd -trim=+1> "rld"
     *  fo|o<fold>bar<fold>wolrd -trim=00> "foo"
     */
    this.getFoldStringAt = function(row, column, trim, foldLine) {
        foldLine = foldLine || this.getFoldLine(row);
        if (!foldLine)
            return null;

        var lastFold = {
            end: { column: 0 }
        };
        // TODO: Refactor to use getNextFoldTo function.
        var str, fold;
        for (var i = 0; i < foldLine.folds.length; i++) {
            fold = foldLine.folds[i];
            var cmp = fold.range.compareEnd(row, column);
            if (cmp == -1) {
                str = this
                    .getLine(fold.start.row)
                    .substring(lastFold.end.column, fold.start.column);
                break;
            }
            else if (cmp === 0) {
                return null;
            }
            lastFold = fold;
        }
        if (!str)
            str = this.getLine(fold.start.row).substring(lastFold.end.column);

        if (trim == -1)
            return str.substring(0, column - lastFold.end.column);
        else if (trim == 1)
            return str.substring(column - lastFold.end.column);
        else
            return str;
    };

    this.getFoldLine = function(docRow, startFoldLine) {
        var foldData = this.$foldData;
        var i = 0;
        if (startFoldLine)
            i = foldData.indexOf(startFoldLine);
        if (i == -1)
            i = 0;
        for (i; i < foldData.length; i++) {
            var foldLine = foldData[i];
            if (foldLine.start.row <= docRow && foldLine.end.row >= docRow) {
                return foldLine;
            } else if (foldLine.end.row > docRow) {
                return null;
            }
        }
        return null;
    };

    // returns the fold which starts after or contains docRow
    this.getNextFoldLine = function(docRow, startFoldLine) {
        var foldData = this.$foldData;
        var i = 0;
        if (startFoldLine)
            i = foldData.indexOf(startFoldLine);
        if (i == -1)
            i = 0;
        for (i; i < foldData.length; i++) {
            var foldLine = foldData[i];
            if (foldLine.end.row >= docRow) {
                return foldLine;
            }
        }
        return null;
    };

    this.getFoldedRowCount = function(first, last) {
        var foldData = this.$foldData, rowCount = last-first+1;
        for (var i = 0; i < foldData.length; i++) {
            var foldLine = foldData[i],
                end = foldLine.end.row,
                start = foldLine.start.row;
            if (end >= last) {
                if(start < last) {
                    if(start >= first)
                        rowCount -= last-start;
                    else
                        rowCount = 0;//in one fold
                }
                break;
            } else if(end >= first){
                if (start >= first) //fold inside range
                    rowCount -=  end-start;
                else
                    rowCount -=  end-first+1;
            }
        }
        return rowCount;
    };

    this.$addFoldLine = function(foldLine) {
        this.$foldData.push(foldLine);
        this.$foldData.sort(function(a, b) {
            return a.start.row - b.start.row;
        });
        return foldLine;
    };

    /*
     * Adds a new fold.
     *
     * @returns
     *      The new created Fold object or an existing fold object in case the
     *      passed in range fits an existing fold exactly.
     */
    this.addFold = function(placeholder, range) {
        var foldData = this.$foldData;
        var added = false;
        var fold;
        
        if (placeholder instanceof Fold)
            fold = placeholder;
        else
            fold = new Fold(range, placeholder);

        this.$clipRangeToDocument(fold.range);

        var startRow = fold.start.row;
        var startColumn = fold.start.column;
        var endRow = fold.end.row;
        var endColumn = fold.end.column;

        // --- Some checking ---
        if (fold.placeholder.length < 2)
            throw "Placeholder has to be at least 2 characters";

        if (startRow == endRow && endColumn - startColumn < 2)
            throw "The range has to be at least 2 characters width";

        var startFold = this.getFoldAt(startRow, startColumn, 1);
        var endFold = this.getFoldAt(endRow, endColumn, -1);
        if (startFold && endFold == startFold)
            return startFold.addSubFold(fold);

        if (
            (startFold && !startFold.range.isStart(startRow, startColumn))
            || (endFold && !endFold.range.isEnd(endRow, endColumn))
        ) {
            throw "A fold can't intersect already existing fold" + fold.range + startFold.range;
        }

        // Check if there are folds in the range we create the new fold for.
        var folds = this.getFoldsInRange(fold.range);
        if (folds.length > 0) {
            // Remove the folds from fold data.
            this.removeFolds(folds);
            // Add the removed folds as subfolds on the new fold.
            fold.subFolds = folds;
        }

        for (var i = 0; i < foldData.length; i++) {
            var foldLine = foldData[i];
            if (endRow == foldLine.start.row) {
                foldLine.addFold(fold);
                added = true;
                break;
            }
            else if (startRow == foldLine.end.row) {
                foldLine.addFold(fold);
                added = true;
                if (!fold.sameRow) {
                    // Check if we might have to merge two FoldLines.
                    var foldLineNext = foldData[i + 1];
                    if (foldLineNext && foldLineNext.start.row == endRow) {
                        // We need to merge!
                        foldLine.merge(foldLineNext);
                        break;
                    }
                }
                break;
            }
            else if (endRow <= foldLine.start.row) {
                break;
            }
        }

        if (!added)
            foldLine = this.$addFoldLine(new FoldLine(this.$foldData, fold));

        if (this.$useWrapMode)
            this.$updateWrapData(foldLine.start.row, foldLine.start.row);

        // Notify that fold data has changed.
        this.$modified = true;
        this._emit("changeFold", { data: fold });

        return fold;
    };

    this.addFolds = function(folds) {
        folds.forEach(function(fold) {
            this.addFold(fold);
        }, this);
    };

    this.removeFold = function(fold) {
        var foldLine = fold.foldLine;
        var startRow = foldLine.start.row;
        var endRow = foldLine.end.row;

        var foldLines = this.$foldData;
        var folds = foldLine.folds;
        // Simple case where there is only one fold in the FoldLine such that
        // the entire fold line can get removed directly.
        if (folds.length == 1) {
            foldLines.splice(foldLines.indexOf(foldLine), 1);
        } else
        // If the fold is the last fold of the foldLine, just remove it.
        if (foldLine.range.isEnd(fold.end.row, fold.end.column)) {
            folds.pop();
            foldLine.end.row = folds[folds.length - 1].end.row;
            foldLine.end.column = folds[folds.length - 1].end.column;
        } else
        // If the fold is the first fold of the foldLine, just remove it.
        if (foldLine.range.isStart(fold.start.row, fold.start.column)) {
            folds.shift();
            foldLine.start.row = folds[0].start.row;
            foldLine.start.column = folds[0].start.column;
        } else
        // We know there are more then 2 folds and the fold is not at the edge.
        // This means, the fold is somewhere in between.
        //
        // If the fold is in one row, we just can remove it.
        if (fold.sameRow) {
            folds.splice(folds.indexOf(fold), 1);
        } else
        // The fold goes over more then one row. This means remvoing this fold
        // will cause the fold line to get splitted up. newFoldLine is the second part
        {
            var newFoldLine = foldLine.split(fold.start.row, fold.start.column);
            folds = newFoldLine.folds;
            folds.shift();
            newFoldLine.start.row = folds[0].start.row;
            newFoldLine.start.column = folds[0].start.column;
        }

        if (this.$useWrapMode) {
            this.$updateWrapData(startRow, endRow);
        }

        // Notify that fold data has changed.
        this.$modified = true;
        this._emit("changeFold", { data: fold });
    };

    this.removeFolds = function(folds) {
        // We need to clone the folds array passed in as it might be the folds
        // array of a fold line and as we call this.removeFold(fold), folds
        // are removed from folds and changes the current index.
        var cloneFolds = [];
        for (var i = 0; i < folds.length; i++) {
            cloneFolds.push(folds[i]);
        }

        cloneFolds.forEach(function(fold) {
            this.removeFold(fold);
        }, this);
        this.$modified = true;
    };

    this.expandFold = function(fold) {
        this.removeFold(fold);
        fold.subFolds.forEach(function(fold) {
            this.addFold(fold);
        }, this);
        fold.subFolds = [];
    };

    this.expandFolds = function(folds) {
        folds.forEach(function(fold) {
            this.expandFold(fold);
        }, this);
    };

    this.unfold = function(location, expandInner) {
        var range, folds;
        if (location == null)
            range = new Range(0, 0, this.getLength(), 0);
        else if (typeof location == "number")
            range = new Range(location, 0, location, this.getLine(location).length);
        else if ("row" in location)
            range = Range.fromPoints(location, location);
        else
            range = location;

        folds = this.getFoldsInRange(range);
        if (expandInner) {
            this.removeFolds(folds);
        } else {
            // TODO: might need to remove and add folds in one go instead of using
            // expandFolds several times.
            while (folds.length) {
                this.expandFolds(folds);
                folds = this.getFoldsInRange(range);
            }
        }
    };

    /*
     * Checks if a given documentRow is folded. This is true if there are some
     * folded parts such that some parts of the line is still visible.
     **/
    this.isRowFolded = function(docRow, startFoldRow) {
        return !!this.getFoldLine(docRow, startFoldRow);
    };

    this.getRowFoldEnd = function(docRow, startFoldRow) {
        var foldLine = this.getFoldLine(docRow, startFoldRow);
        return (foldLine
            ? foldLine.end.row
            : docRow);
    };

    this.getFoldDisplayLine = function(foldLine, endRow, endColumn, startRow, startColumn) {
        if (startRow == null) {
            startRow = foldLine.start.row;
            startColumn = 0;
        }

        if (endRow == null) {
            endRow = foldLine.end.row;
            endColumn = this.getLine(endRow).length;
        }

        // Build the textline using the FoldLine walker.
        var doc = this.doc;
        var textLine = "";

        foldLine.walk(function(placeholder, row, column, lastColumn) {
            if (row < startRow) {
                return;
            } else if (row == startRow) {
                if (column < startColumn) {
                    return;
                }
                lastColumn = Math.max(startColumn, lastColumn);
            }
            if (placeholder) {
                textLine += placeholder;
            } else {
                textLine += doc.getLine(row).substring(lastColumn, column);
            }
        }.bind(this), endRow, endColumn);
        return textLine;
    };

    this.getDisplayLine = function(row, endColumn, startRow, startColumn) {
        var foldLine = this.getFoldLine(row);

        if (!foldLine) {
            var line;
            line = this.doc.getLine(row);
            return line.substring(startColumn || 0, endColumn || line.length);
        } else {
            return this.getFoldDisplayLine(
                foldLine, row, endColumn, startRow, startColumn);
        }
    };

    this.$cloneFoldData = function() {
        var fd = [];
        fd = this.$foldData.map(function(foldLine) {
            var folds = foldLine.folds.map(function(fold) {
                return fold.clone();
            });
            return new FoldLine(fd, folds);
        });

        return fd;
    };

    this.toggleFold = function(tryToUnfold) {
        var selection = this.selection;
        var range = selection.getRange();
        var fold;
        var bracketPos;

        if (range.isEmpty()) {
            var cursor = range.start;
            fold = this.getFoldAt(cursor.row, cursor.column);

            if (fold) {
                this.expandFold(fold);
                return;
            }
            else if (bracketPos = this.findMatchingBracket(cursor)) {
                if (range.comparePoint(bracketPos) == 1) {
                    range.end = bracketPos;
                } 
                else {
                    range.start = bracketPos;
                    range.start.column++;
                    range.end.column--;
                }
            }
            else if (bracketPos = this.findMatchingBracket({row: cursor.row, column: cursor.column + 1})) {
                if (range.comparePoint(bracketPos) == 1)
                    range.end = bracketPos;
                else
                    range.start = bracketPos;

                range.start.column++;
            }
            else {
                range = this.getCommentFoldRange(cursor.row, cursor.column) || range;
            }
        } else {
            var folds = this.getFoldsInRange(range);
            if (tryToUnfold && folds.length) {
                this.expandFolds(folds);
                return;
            } 
            else if (folds.length == 1 ) {
                fold = folds[0];
            }
        }

        if (!fold)
            fold = this.getFoldAt(range.start.row, range.start.column);

        if (fold && fold.range.toString() == range.toString()) {
            this.expandFold(fold);
            return;
        }

        var placeholder = "...";
        if (!range.isMultiLine()) {
            placeholder = this.getTextRange(range);
            if(placeholder.length < 4)
                return;
            placeholder = placeholder.trim().substring(0, 2) + "..";
        }

        this.addFold(placeholder, range);
    };

    this.getCommentFoldRange = function(row, column) {
        var iterator = new TokenIterator(this, row, column);
        var token = iterator.getCurrentToken();
        if (token && /^comment|string/.test(token.type)) {
            var range = new Range();
            var re = new RegExp(token.type.replace(/\..*/, "\\."));
            do {
                token = iterator.stepBackward();
            } while(token && re.test(token.type));

            iterator.stepForward();
            range.start.row = iterator.getCurrentTokenRow();
            range.start.column = iterator.getCurrentTokenColumn() + 2;

            iterator = new TokenIterator(this, row, column);

            do {
                token = iterator.stepForward();
            } while(token && re.test(token.type));
            
            token = iterator.stepBackward();

            range.end.row = iterator.getCurrentTokenRow();
            range.end.column = iterator.getCurrentTokenColumn() + token.value.length;
            return range;
        }
    };

    this.foldAll = function(startRow, endRow) {
        var foldWidgets = this.foldWidgets;
        endRow = endRow || this.getLength();
        for (var row = startRow || 0; row < endRow; row++) {
            if (foldWidgets[row] == null)
                foldWidgets[row] = this.getFoldWidget(row);
            if (foldWidgets[row] != "start")
                continue;

            var range = this.getFoldWidgetRange(row);
            // sometimes range can be incompatible with existing fold
            // wouldn't it be better for addFold to return null istead of throwing?
            if (range && range.end.row < endRow) try {
                this.addFold("...", range);
            } catch(e) {}
        }
    };
    
    this.$foldStyles = {
        "manual": 1,
        "markbegin": 1,
        "markbeginend": 1
    };
    this.$foldStyle = "markbegin";
    this.setFoldStyle = function(style) {
        if (!this.$foldStyles[style])
            throw new Error("invalid fold style: " + style + "[" + Object.keys(this.$foldStyles).join(", ") + "]");
        
        if (this.$foldStyle == style)
            return;

        this.$foldStyle = style;
        
        if (style == "manual")
            this.unfold();
        
        // reset folding
        var mode = this.$foldMode;
        this.$setFolding(null);
        this.$setFolding(mode);
    };

    // structured folding
    this.$setFolding = function(foldMode) {
        if (this.$foldMode == foldMode)
            return;
            
        this.$foldMode = foldMode;
        
        this.removeListener('change', this.$updateFoldWidgets);
        this._emit("changeAnnotation");
        
        if (!foldMode || this.$foldStyle == "manual") {
            this.foldWidgets = null;
            return;
        }
        
        this.foldWidgets = [];
        this.getFoldWidget = foldMode.getFoldWidget.bind(foldMode, this, this.$foldStyle);
        this.getFoldWidgetRange = foldMode.getFoldWidgetRange.bind(foldMode, this, this.$foldStyle);
        
        this.$updateFoldWidgets = this.updateFoldWidgets.bind(this);
        this.on('change', this.$updateFoldWidgets);
        
    };

    this.onFoldWidgetClick = function(row, e) {
        var type = this.getFoldWidget(row);
        var line = this.getLine(row);
        var onlySubfolds = e.shiftKey;
        var addSubfolds = onlySubfolds || e.ctrlKey || e.altKey || e.metaKey;
        var fold;

        if (type == "end")
            fold = this.getFoldAt(row, 0, -1);
        else
            fold = this.getFoldAt(row, line.length, 1);

        if (fold) {
            if (addSubfolds)
                this.removeFold(fold);
            else
                this.expandFold(fold);
            return;
        }

        var range = this.getFoldWidgetRange(row);
        if (range) {
            // sometimes singleline folds can be missed by the code above
            if (!range.isMultiLine()) {
                fold = this.getFoldAt(range.start.row, range.start.column, 1);
                if (fold && range.isEqual(fold.range)) {
                    this.removeFold(fold);
                    return;
                }
            }
            
            if (!onlySubfolds)
                this.addFold("...", range);

            if (addSubfolds)
                this.foldAll(range.start.row + 1, range.end.row);
        } else {
            if (addSubfolds)
                this.foldAll(row + 1, this.getLength());
            e.target.className += " invalid"
        }
    };
    
    this.updateFoldWidgets = function(e) {
        var delta = e.data;
        var range = delta.range;
        var firstRow = range.start.row;
        var len = range.end.row - firstRow;

        if (len === 0) {
            this.foldWidgets[firstRow] = null;
        } else if (delta.action == "removeText" || delta.action == "removeLines") {
            this.foldWidgets.splice(firstRow, len + 1, null);
        } else {
            var args = Array(len + 1);
            args.unshift(firstRow, 1);
            this.foldWidgets.splice.apply(this.foldWidgets, args);
        }
    };

}

exports.Folding = Folding;

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
 *      Julian Viereck <julian DOT viereck AT gmail DOT com>
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

ace.define('ace/edit_session/fold_line', ['require', 'exports', 'module' , 'ace/range'], function(require, exports, module) {
"use strict";

var Range = require("../range").Range;

/*
 * If an array is passed in, the folds are expected to be sorted already.
 */
function FoldLine(foldData, folds) {
    this.foldData = foldData;
    if (Array.isArray(folds)) {
        this.folds = folds;
    } else {
        folds = this.folds = [ folds ];
    }

    var last = folds[folds.length - 1]
    this.range = new Range(folds[0].start.row, folds[0].start.column,
                           last.end.row, last.end.column);
    this.start = this.range.start;
    this.end   = this.range.end;

    this.folds.forEach(function(fold) {
        fold.setFoldLine(this);
    }, this);
}

(function() {
    /*
     * Note: This doesn't update wrapData!
     */
    this.shiftRow = function(shift) {
        this.start.row += shift;
        this.end.row += shift;
        this.folds.forEach(function(fold) {
            fold.start.row += shift;
            fold.end.row += shift;
        });
    }

    this.addFold = function(fold) {
        if (fold.sameRow) {
            if (fold.start.row < this.startRow || fold.endRow > this.endRow) {
                throw "Can't add a fold to this FoldLine as it has no connection";
            }
            this.folds.push(fold);
            this.folds.sort(function(a, b) {
                return -a.range.compareEnd(b.start.row, b.start.column);
            });
            if (this.range.compareEnd(fold.start.row, fold.start.column) > 0) {
                this.end.row = fold.end.row;
                this.end.column =  fold.end.column;
            } else if (this.range.compareStart(fold.end.row, fold.end.column) < 0) {
                this.start.row = fold.start.row;
                this.start.column = fold.start.column;
            }
        } else if (fold.start.row == this.end.row) {
            this.folds.push(fold);
            this.end.row = fold.end.row;
            this.end.column = fold.end.column;
        } else if (fold.end.row == this.start.row) {
            this.folds.unshift(fold);
            this.start.row = fold.start.row;
            this.start.column = fold.start.column;
        } else {
            throw "Trying to add fold to FoldRow that doesn't have a matching row";
        }
        fold.foldLine = this;
    }

    this.containsRow = function(row) {
        return row >= this.start.row && row <= this.end.row;
    }

    this.walk = function(callback, endRow, endColumn) {
        var lastEnd = 0,
            folds = this.folds,
            fold,
            comp, stop, isNewRow = true;

        if (endRow == null) {
            endRow = this.end.row;
            endColumn = this.end.column;
        }

        for (var i = 0; i < folds.length; i++) {
            fold = folds[i];

            comp = fold.range.compareStart(endRow, endColumn);
            // This fold is after the endRow/Column.
            if (comp == -1) {
                callback(null, endRow, endColumn, lastEnd, isNewRow);
                return;
            }

            stop = callback(null, fold.start.row, fold.start.column, lastEnd, isNewRow);
            stop = !stop && callback(fold.placeholder, fold.start.row, fold.start.column, lastEnd);

            // If the user requested to stop the walk or endRow/endColumn is
            // inside of this fold (comp == 0), then end here.
            if (stop || comp == 0) {
                return;
            }

            // Note the new lastEnd might not be on the same line. However,
            // it's the callback's job to recognize this.
            isNewRow = !fold.sameRow;
            lastEnd = fold.end.column;
        }
        callback(null, endRow, endColumn, lastEnd, isNewRow);
    }

    this.getNextFoldTo = function(row, column) {
        var fold, cmp;
        for (var i = 0; i < this.folds.length; i++) {
            fold = this.folds[i];
            cmp = fold.range.compareEnd(row, column);
            if (cmp == -1) {
                return {
                    fold: fold,
                    kind: "after"
                };
            } else if (cmp == 0) {
                return {
                    fold: fold,
                    kind: "inside"
                }
            }
        }
        return null;
    }

    this.addRemoveChars = function(row, column, len) {
        var ret = this.getNextFoldTo(row, column),
            fold, folds;
        if (ret) {
            fold = ret.fold;
            if (ret.kind == "inside"
                && fold.start.column != column
                && fold.start.row != row)
            {
                //throwing here breaks whole editor
                //@todo properly handle this
                window.console && window.console.log(row, column, fold);
            } else if (fold.start.row == row) {
                folds = this.folds;
                var i = folds.indexOf(fold);
                if (i == 0) {
                    this.start.column += len;
                }
                for (i; i < folds.length; i++) {
                    fold = folds[i];
                    fold.start.column += len;
                    if (!fold.sameRow) {
                        return;
                    }
                    fold.end.column += len;
                }
                this.end.column += len;
            }
        }
    }

    this.split = function(row, column) {
        var fold = this.getNextFoldTo(row, column).fold,
            folds = this.folds;
        var foldData = this.foldData;

        if (!fold) {
            return null;
        }
        var i = folds.indexOf(fold);
        var foldBefore = folds[i - 1];
        this.end.row = foldBefore.end.row;
        this.end.column = foldBefore.end.column;

        // Remove the folds after row/column and create a new FoldLine
        // containing these removed folds.
        folds = folds.splice(i, folds.length - i);

        var newFoldLine = new FoldLine(foldData, folds);
        foldData.splice(foldData.indexOf(this) + 1, 0, newFoldLine);
        return newFoldLine;
    }

    this.merge = function(foldLineNext) {
        var folds = foldLineNext.folds;
        for (var i = 0; i < folds.length; i++) {
            this.addFold(folds[i]);
        }
        // Remove the foldLineNext - no longer needed, as
        // it's merged now with foldLineNext.
        var foldData = this.foldData;
        foldData.splice(foldData.indexOf(foldLineNext), 1);
    }

    this.toString = function() {
        var ret = [this.range.toString() + ": [" ];

        this.folds.forEach(function(fold) {
            ret.push("  " + fold.toString());
        });
        ret.push("]")
        return ret.join("\n");
    }

    this.idxToPosition = function(idx) {
        var lastFoldEndColumn = 0;
        var fold;

        for (var i = 0; i < this.folds.length; i++) {
            var fold = this.folds[i];

            idx -= fold.start.column - lastFoldEndColumn;
            if (idx < 0) {
                return {
                    row: fold.start.row,
                    column: fold.start.column + idx
                };
            }

            idx -= fold.placeholder.length;
            if (idx < 0) {
                return fold.start;
            }

            lastFoldEndColumn = fold.end.column;
        }

        return {
            row: this.end.row,
            column: this.end.column + idx
        };
    }
}).call(FoldLine.prototype);

exports.FoldLine = FoldLine;
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
 *      Julian Viereck <julian DOT viereck AT gmail DOT com>
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

ace.define('ace/edit_session/fold', ['require', 'exports', 'module' ], function(require, exports, module) {
"use strict";

/*
 * Simple fold-data struct.
 **/
var Fold = exports.Fold = function(range, placeholder) {
    this.foldLine = null;
    this.placeholder = placeholder;
    this.range = range;
    this.start = range.start;
    this.end = range.end;

    this.sameRow = range.start.row == range.end.row;
    this.subFolds = [];
};

(function() {

    this.toString = function() {
        return '"' + this.placeholder + '" ' + this.range.toString();
    };

    this.setFoldLine = function(foldLine) {
        this.foldLine = foldLine;
        this.subFolds.forEach(function(fold) {
            fold.setFoldLine(foldLine);
        });
    };

    this.clone = function() {
        var range = this.range.clone();
        var fold = new Fold(range, this.placeholder);
        this.subFolds.forEach(function(subFold) {
            fold.subFolds.push(subFold.clone());
        });
        return fold;
    };

    this.addSubFold = function(fold) {
        if (this.range.isEqual(fold))
            return this;

        if (!this.range.containsRange(fold))
            throw "A fold can't intersect already existing fold" + fold.range + this.range;

        var row = fold.range.start.row, column = fold.range.start.column;
        for (var i = 0, cmp = -1; i < this.subFolds.length; i++) {
            cmp = this.subFolds[i].range.compare(row, column);
            if (cmp != 1)
                break;
        }
        var afterStart = this.subFolds[i];

        if (cmp == 0)
            return afterStart.addSubFold(fold)

        // cmp == -1
        var row = fold.range.end.row, column = fold.range.end.column;
        for (var j = i, cmp = -1; j < this.subFolds.length; j++) {
            cmp = this.subFolds[j].range.compare(row, column);
            if (cmp != 1)
                break;
        }
        var afterEnd = this.subFolds[j];

        if (cmp == 0)
            throw "A fold can't intersect already existing fold" + fold.range + this.range;

        var consumedFolds = this.subFolds.splice(i, j - i, fold)
        fold.setFoldLine(this.foldLine);

        return fold;
    }

}).call(Fold.prototype);

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

ace.define('ace/token_iterator', ['require', 'exports', 'module' ], function(require, exports, module) {
"use strict";

/**
 * class TokenIterator
 *
 * This class provides an essay way to treat the document as a stream of tokens, and provides methods to iterate over these tokens.
 *
 **/

/**
 * new TokenIterator(session, initialRow, initialColumn)
 * - session (EditSession): The session to associate with
 * - initialRow (Number): The row to start the tokenizing at
 * - initialColumn (Number): The column to start the tokenizing at
 *
 * Creates a new token iterator object. The inital token index is set to the provided row and column coordinates.
 *
 **/
var TokenIterator = function(session, initialRow, initialColumn) {
    this.$session = session;
    this.$row = initialRow;
    this.$rowTokens = session.getTokens(initialRow, initialRow)[0].tokens;

    var token = session.getTokenAt(initialRow, initialColumn);
    this.$tokenIndex = token ? token.index : -1;
};

(function() {
   
    /**
    * TokenIterator.stepBackward() -> [String]
    * + (String): If the current point is not at the top of the file, this function returns `null`. Otherwise, it returns an array of the tokenized strings.
    * 
    * Tokenizes all the items from the current point to the row prior in the document. 
    **/ 
    this.stepBackward = function() {
        this.$tokenIndex -= 1;
        
        while (this.$tokenIndex < 0) {
            this.$row -= 1;
            if (this.$row < 0) {
                this.$row = 0;
                return null;
            }
                
            this.$rowTokens = this.$session.getTokens(this.$row, this.$row)[0].tokens;
            this.$tokenIndex = this.$rowTokens.length - 1;
        }
            
        return this.$rowTokens[this.$tokenIndex];
    };
  
    /**
    * TokenIterator.stepForward() -> String
    * 
    * Tokenizes all the items from the current point until the next row in the document. If the current point is at the end of the file, this function returns `null`. Otherwise, it returns the tokenized string.
    **/   
    this.stepForward = function() {
        var rowCount = this.$session.getLength();
        this.$tokenIndex += 1;
        
        while (this.$tokenIndex >= this.$rowTokens.length) {
            this.$row += 1;
            if (this.$row >= rowCount) {
                this.$row = rowCount - 1;
                return null;
            }

            this.$rowTokens = this.$session.getTokens(this.$row, this.$row)[0].tokens;
            this.$tokenIndex = 0;
        }
            
        return this.$rowTokens[this.$tokenIndex];
    };
 
    /**
    * TokenIterator.getCurrentToken() -> String
    * 
    * Returns the current tokenized string.
    *
    **/      
    this.getCurrentToken = function () {
        return this.$rowTokens[this.$tokenIndex];
    };

    /**
    * TokenIterator.getCurrentTokenRow() -> Number
    * 
    * Returns the current row.
    *
    **/      
    this.getCurrentTokenRow = function () {
        return this.$row;
    };

    /**
    * TokenIterator.getCurrentTokenColumn() -> Number
    * 
    * Returns the current column.
    *
    **/     
    this.getCurrentTokenColumn = function() {
        var rowTokens = this.$rowTokens;
        var tokenIndex = this.$tokenIndex;
        
        // If a column was cached by EditSession.getTokenAt, then use it
        var column = rowTokens[tokenIndex].start;
        if (column !== undefined)
            return column;
            
        column = 0;
        while (tokenIndex > 0) {
            tokenIndex -= 1;
            column += rowTokens[tokenIndex].value.length;
        }
        
        return column;  
    };
            
}).call(TokenIterator.prototype);

exports.TokenIterator = TokenIterator;
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

ace.define('ace/edit_session/bracket_match', ['require', 'exports', 'module' , 'ace/token_iterator'], function(require, exports, module) {
"use strict";

var TokenIterator = require("../token_iterator").TokenIterator;

/**
 * class BracketMatch
 *
 * 
 *
 *
 **/

/**
 * new BracketMatch(position)
 * - platform (String): Identifier for the platform; must be either `'mac'` or `'win'`
 * - commands (Array): A list of commands
 *
 * TODO
 *
 *
 **/
function BracketMatch() {

    /**
     * new findMatchingBracket(position)
     * - position (Number): Identifier for the platform; must be either `'mac'` or `'win'`
     * - commands (Array): A list of commands
     *
     * TODO
     *
     *
     **/
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
        var depth = 1;

        var iterator = new TokenIterator(this, position.row, position.column);
        var token = iterator.getCurrentToken();
        if (!token) return null;
        
        // token.type contains a period-delimited list of token identifiers
        // (e.g.: "constant.numeric" or "paren.lparen").  Create a pattern that
        // matches any token containing the same identifiers or a subset.  In
        // addition, if token.type includes "rparen", then also match "lparen".
        // So if type.token is "paren.rparen", then typeRe will match "lparen.paren".
        var typeRe = new RegExp("(\\.?" +
            token.type.replace(".", "|").replace("rparen", "lparen|rparen") + ")+");
        
        // Start searching in token, just before the character at position.column
        var valueIndex = position.column - iterator.getCurrentTokenColumn() - 2;
        var value = token.value;
        
        while (true) {
        
            while (valueIndex >= 0) {
                var chr = value.charAt(valueIndex);
                if (chr == openBracket) {
                    depth -= 1;
                    if (depth == 0) {
                        return {row: iterator.getCurrentTokenRow(),
                            column: valueIndex + iterator.getCurrentTokenColumn()};
                    }
                }
                else if (chr == bracket) {
                    depth += 1;
                }
                valueIndex -= 1;
            }

            // Scan backward through the document, looking for the next token
            // whose type matches typeRe
            do {
                token = iterator.stepBackward();
            } while (token && !typeRe.test(token.type));

            if (token == null)
                break;
                
            value = token.value;
            valueIndex = value.length - 1;
        }
        
        return null;
    };

    this.$findClosingBracket = function(bracket, position) {
        var closingBracket = this.$brackets[bracket];
        var depth = 1;

        var iterator = new TokenIterator(this, position.row, position.column);
        var token = iterator.getCurrentToken();
        if (!token) return null;

        // token.type contains a period-delimited list of token identifiers
        // (e.g.: "constant.numeric" or "paren.lparen").  Create a pattern that
        // matches any token containing the same identifiers or a subset.  In
        // addition, if token.type includes "lparen", then also match "rparen".
        // So if type.token is "lparen.paren", then typeRe will match "paren.rparen".
        var typeRe = new RegExp("(\\.?" +
            token.type.replace(".", "|").replace("lparen", "lparen|rparen") + ")+");

        // Start searching in token, after the character at position.column
        var valueIndex = position.column - iterator.getCurrentTokenColumn();

        while (true) {

            var value = token.value;
            var valueLength = value.length;
            while (valueIndex < valueLength) {
                var chr = value.charAt(valueIndex);
                if (chr == closingBracket) {
                    depth -= 1;
                    if (depth == 0) {
                        return {row: iterator.getCurrentTokenRow(),
                            column: valueIndex + iterator.getCurrentTokenColumn()};
                    }
                }
                else if (chr == bracket) {
                    depth += 1;
                }
                valueIndex += 1;
            }

            // Scan forward through the document, looking for the next token
            // whose type matches typeRe
            do {
                token = iterator.stepForward();
            } while (token && !typeRe.test(token.type));

            if (token == null)
                break;

            valueIndex = 0;
        }
        
        return null;
    };
}
exports.BracketMatch = BracketMatch;

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
 *      Mihai Sucan <mihai DOT sucan AT gmail DOT com>
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

ace.define('ace/search', ['require', 'exports', 'module' , 'ace/lib/lang', 'ace/lib/oop', 'ace/range'], function(require, exports, module) {
"use strict";

var lang = require("./lib/lang");
var oop = require("./lib/oop");
var Range = require("./range").Range;

/**
 * class Search
 *
 * A class designed to handle all sorts of text searches within a [[Document `Document`]].
 *
 **/

/**
 * new Search()
 *
 * Creates a new `Search` object. The search options contain the following defaults:
 *
 * * `needle`: `""`
 * * `backwards`: `false`
 * * `wrap`: `false`
 * * `caseSensitive`: `false`
 * * `wholeWord`: `false`
 * * `scope`: `ALL`
 * * `regExp`: `false`
 * 
**/

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

    /**
     * Search.set(options) -> Search
     * - options (Object): An object containing all the new search properties
     *
     * Sets the search options via the `options` parameter.
     * 
    **/
    this.set = function(options) {
        oop.mixin(this.$options, options);
        return this;
    };

    /**
     * Search.getOptions() -> Object
     *
     * [Returns an object containing all the search options.]{: #Search.getOptions}
     * 
    **/    
    this.getOptions = function() {
        return lang.copyObject(this.$options);
    };

    /**
     * Search.find(session) -> Range
     * - session (EditSession): The session to search with
     *
     * Searches for `options.needle`. If found, this method returns the [[Range `Range`]] where the text first occurs. If `options.backwards` is `true`, the search goes backwards in the session.
     * 
    **/ 
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

    /**
     * Search.findAll(session) -> [Range]
     * - session (EditSession): The session to search with
     *
     * Searches for all occurances `options.needle`. If found, this method returns an array of [[Range `Range`s]] where the text first occurs. If `options.backwards` is `true`, the search goes backwards in the session.
     * 
    **/ 
    this.findAll = function(session) {
        var options = this.$options;
        if (!options.needle)
            return [];

        if (options.backwards) {
            var iterator = this.$backwardMatchIterator(session);
        } else {
            iterator = this.$forwardMatchIterator(session);
        }

        var ignoreCursor = !options.start && options.wrap && options.scope == Search.ALL;
        if (ignoreCursor)
            options.start = {row: 0, column: 0};

        var ranges = [];
        iterator.forEach(function(range) {
            ranges.push(range);
        });

        if (ignoreCursor)
            options.start = null;

        return ranges;
    };

    /**
     * Search.replace(input, replacement) -> String
     * - input (String): The text to search in
     * - replacement (String): The replacing text
     * + (String): If `options.regExp` is `true`, this function returns `input` with the replacement already made. Otherwise, this function just returns `replacement`.<br/>
     * If `options.needle` was not found, this function returns `null`.
     *
     * Searches for `options.needle` in `input`, and, if found, replaces it with `replacement`. 
     *
     * 
     * 
    **/ 
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

    /** internal, hide
     * Search.$forwardMatchIterator(session) -> String | Boolean
     * - session (EditSession): The session to search with
     *
     * 
     * 
    **/ 
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

    /** internal, hide
     * Search.$backwardMatchIterator(session) -> String
     * - session (EditSession): The session to search with
     *
     * 
     * 
    **/ 
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

        var range = this.$options.range || session.getSelection().getRange();
        var start = this.$options.start || range[searchSelection ? "start" : "end"];

        var firstRow = searchSelection ? range.start.row : 0;
        var firstColumn = searchSelection ? range.start.column : 0;
        var lastRow = searchSelection ? range.end.row : session.getLength() - 1;

        var wrap = this.$options.wrap;
        var inWrap = false;

        function getLine(row) {
            var line = session.getLine(row);
            if (searchSelection && row == range.end.row) {
                line = line.substring(0, range.end.column);
            }
            if (inWrap && row == start.row) {
                line = line.substring(0, start.column);
            }
            return line;
        }

        return {
            forEach: function(callback) {
                var row = start.row;

                var line = getLine(row);
                var startIndex = start.column;

                var stop = false;
                inWrap = false;

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
                            inWrap = true;
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

        var range = this.$options.range || session.getSelection().getRange();
        var start = this.$options.start || range[searchSelection ? "end" : "start"];

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
                var inWrap = false;

                while (!callback(line, startIndex, row)) {

                    if (stop)
                        return;

                    row--;
                    startIndex = 0;

                    if (row < firstRow) {
                        if (wrap) {
                            row = lastRow;
                            inWrap = true;
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

                    if (inWrap && row == start.row)
                        startIndex = start.column;
                }
            }
        };
    };

}).call(Search.prototype);

exports.Search = Search;
});
ace.define('ace/commands/command_manager', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/keyboard/hash_handler', 'ace/lib/event_emitter'], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var HashHandler = require("../keyboard/hash_handler").HashHandler;
var EventEmitter = require("../lib/event_emitter").EventEmitter;

/**
 * class CommandManager
 *
 * 
 *
 *
 **/

/**
 * new CommandManager(platform, commands)
 * - platform (String): Identifier for the platform; must be either `'mac'` or `'win'`
 * - commands (Array): A list of commands
 *
 * TODO
 *
 *
 **/

var CommandManager = function(platform, commands) {
    this.platform = platform;
    this.commands = {};
    this.commmandKeyBinding = {};

    this.addCommands(commands);
    
    this.setDefaultHandler("exec", function(e) {
        return e.command.exec(e.editor, e.args || {});
    });
};

oop.inherits(CommandManager, HashHandler);

(function() {

    oop.implement(this, EventEmitter);

    this.exec = function(command, editor, args) {
        if (typeof command === 'string')
            command = this.commands[command];

        if (!command)
            return false;

        if (editor && editor.$readOnly && !command.readOnly)
            return false;

        try {
            var retvalue = this._emit("exec", {
                editor: editor,
                command: command,
                args: args
            });
        } catch (e) {
            window.console && window.console.log(e);
            return true;
        }

        return retvalue === false ? false : true;
    };

    this.toggleRecording = function() {
        if (this.$inReplay)
            return;
        if (this.recording) {
            this.macro.pop();
            this.removeEventListener("exec", this.$addCommandToMacro);

            if (!this.macro.length)
                this.macro = this.oldMacro;

            return this.recording = false;
        }
        if (!this.$addCommandToMacro) {
            this.$addCommandToMacro = function(e) {
                    this.macro.push([e.command, e.args]);
                }.bind(this);
        }

        this.oldMacro = this.macro;
        this.macro = [];
        this.on("exec", this.$addCommandToMacro);
        return this.recording = true;
    };

    this.replay = function(editor) {
        if (this.$inReplay || !this.macro)
            return;

        if (this.recording)
            return this.toggleRecording();

        try {
            this.$inReplay = true;
            this.macro.forEach(function(x) {
                if (typeof x == "string")
                    this.exec(x, editor);
                else
                    this.exec(x[0], editor, x[1]);
            }, this);
        } finally {
            this.$inReplay = false;
        }
    };

    this.trimMacro = function(m) {
        return m.map(function(x){
            if (typeof x[0] != "string")
                x[0] = x[0].name;
            if (!x[1])
                x = x[0];
            return x;
        });
    };

}).call(CommandManager.prototype);

exports.CommandManager = CommandManager;

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

ace.define('ace/keyboard/hash_handler', ['require', 'exports', 'module' , 'ace/lib/keys'], function(require, exports, module) {
"use strict";

var keyUtil  = require("../lib/keys");

function HashHandler(config, platform) {
    this.platform = platform;
    this.commands = {};
    this.commmandKeyBinding = {};

    this.addCommands(config);
};

(function() {

    this.addCommand = function(command) {
        if (this.commands[command.name])
            this.removeCommand(command);

        this.commands[command.name] = command;

        if (command.bindKey) {
            this._buildKeyHash(command);
        }
    };

    this.removeCommand = function(command) {
        var name = (typeof command === 'string' ? command : command.name);
        command = this.commands[name];
        delete this.commands[name];

        // exhaustive search is brute force but since removeCommand is
        // not a performance critical operation this should be OK
        var ckb = this.commmandKeyBinding;
        for (var hashId in ckb) {
            for (var key in ckb[hashId]) {
                if (ckb[hashId][key] == command)
                    delete ckb[hashId][key];
            }
        }
    };

    this.bindKey = function(key, command) {
        if(!key)
            return;

        var ckb = this.commmandKeyBinding;
        key.split("|").forEach(function(keyPart) {
            var binding = this.parseKeys(keyPart, command);
            var hashId = binding.hashId;
            (ckb[hashId] || (ckb[hashId] = {}))[binding.key] = command;
        }, this);
    };

    this.addCommands = function(commands) {
        commands && Object.keys(commands).forEach(function(name) {
            var command = commands[name];
            if (typeof command === "string")
                return this.bindKey(command, name);

            if (typeof command === "function")
                command = { exec: command };

            if (!command.name)
                command.name = name;

            this.addCommand(command);
        }, this);
    };

    this.removeCommands = function(commands) {
        Object.keys(commands).forEach(function(name) {
            this.removeCommand(commands[name]);
        }, this);
    };

    this.bindKeys = function(keyList) {
        Object.keys(keyList).forEach(function(key) {
            this.bindKey(key, keyList[key]);
        }, this);
    };

    this._buildKeyHash = function(command) {
        var binding = command.bindKey;
        if (!binding)
            return;

        var key = typeof binding == "string" ? binding: binding[this.platform];
        this.bindKey(key, command);
    };

    this.parseKeys = function(keys, val) {
        var key;
        var hashId = 0;
        var parts = keys.toLowerCase().trim().split(/\s*\-\s*/);

        for (var i = 0, l = parts.length; i < l; i++) {
            if (keyUtil.KEY_MODS[parts[i]])
                hashId = hashId | keyUtil.KEY_MODS[parts[i]];
            else
                key = parts[i] || "-"; //when empty, the splitSafe removed a '-'
        }

        return {
            key: key,
            hashId: hashId
        };
    };

    this.findKeyCommand = function findKeyCommand(hashId, keyString) {
        var ckbr = this.commmandKeyBinding;
        return ckbr[hashId] && ckbr[hashId][keyString.toLowerCase()];
    };

    this.handleKeyboard = function(data, hashId, keyString, keyCode) {
        return {
            command: this.findKeyCommand(hashId, keyString)
        };
    };

}).call(HashHandler.prototype)

exports.HashHandler = HashHandler;
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
 *      Mihai Sucan <mihai DOT sucan AT gmail DOT com>
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

ace.define('ace/undomanager', ['require', 'exports', 'module' ], function(require, exports, module) {
"use strict";

/**
 * class UndoManager
 *
 * This object maintains the undo stack for an [[EditSession `EditSession`]].
 *
 **/

/**
 * new UndoManager()
 * 
 * Resets the current undo state and creates a new `UndoManager`.
 **/
var UndoManager = function() {
    this.reset();
};

(function() {

    /**
    * UndoManager.execute(options) -> Void
    * - options (Object): Contains additional properties
    *
    * Provides a means for implementing your own undo manager. `options` has one property, `args`, an [[Array `Array`]], with two elements:
    * * `args[0]` is an array of deltas
    * * `args[1]` is the document to associate with
    *
    **/
    this.execute = function(options) {
        var deltas = options.args[0];
        this.$doc  = options.args[1];
        this.$undoStack.push(deltas);
        this.$redoStack = [];
    };

    /**
    * UndoManager.undo(dontSelect) -> Range
    * - dontSelect (Boolean): {:dontSelect}
    *
    * [Perform an undo operation on the document, reverting the last change. Returns the range of the undo.]{: #UndoManager.undo}
    **/
    this.undo = function(dontSelect) {
        var deltas = this.$undoStack.pop();
        var undoSelectionRange = null;
        if (deltas) {
            undoSelectionRange =
                this.$doc.undoChanges(deltas, dontSelect);
            this.$redoStack.push(deltas);
        }
        return undoSelectionRange;
    };

    /**
    * UndoManager.redo(dontSelect) -> Void
    * - dontSelect (Boolean): {:dontSelect}
    *
    * [Perform a redo operation on the document, reimplementing the last change.]{: #UndoManager.redo}
    **/
    this.redo = function(dontSelect) {
        var deltas = this.$redoStack.pop();
        var redoSelectionRange = null;
        if (deltas) {
            redoSelectionRange =
                this.$doc.redoChanges(deltas, dontSelect);
            this.$undoStack.push(deltas);
        }
        return redoSelectionRange;
    };

    /**
    * UndoManager.reset() -> Void
    *
    * Destroys the stack of undo and redo redo operations.
    **/
    this.reset = function() {
        this.$undoStack = [];
        this.$redoStack = [];
    };

    /**
    * UndoManager.hasUndo() -> Boolean
    *
    * Returns `true` if there are undo operations left to perform.
    **/
    this.hasUndo = function() {
        return this.$undoStack.length > 0;
    };

    /**
    * UndoManager.hasRedo() -> Boolean
    *
    * Returns `true` if there are redo operations left to perform.
    **/
    this.hasRedo = function() {
        return this.$redoStack.length > 0;
    };

}).call(UndoManager.prototype);

exports.UndoManager = UndoManager;
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

ace.define('ace/virtual_renderer', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/lib/dom', 'ace/lib/event', 'ace/lib/useragent', 'ace/config', 'ace/lib/net', 'ace/layer/gutter', 'ace/layer/marker', 'ace/layer/text', 'ace/layer/cursor', 'ace/scrollbar', 'ace/renderloop', 'ace/lib/event_emitter', 'text!ace/css/editor.css'], function(require, exports, module) {
"use strict";

var oop = require("./lib/oop");
var dom = require("./lib/dom");
var event = require("./lib/event");
var useragent = require("./lib/useragent");
var config = require("./config");
var net = require("./lib/net");
var GutterLayer = require("./layer/gutter").Gutter;
var MarkerLayer = require("./layer/marker").Marker;
var TextLayer = require("./layer/text").Text;
var CursorLayer = require("./layer/cursor").Cursor;
var ScrollBar = require("./scrollbar").ScrollBar;
var RenderLoop = require("./renderloop").RenderLoop;
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var editorCss = require("text!./css/editor.css");

dom.importCssString(editorCss, "ace_editor");

/**
 * class VirtualRenderer
 *
 * The class that is responsible for drawing everything you see on the screen!
 *
 **/

/**
 * new VirtualRenderer(container, theme)
 * - container (DOMElement): The root element of the editor 
 * - theme (String): The starting theme
 *
 * Constructs a new `VirtualRenderer` within the `container` specified, applying the given `theme`.
 *
 **/

var VirtualRenderer = function(container, theme) {
    var _self = this;

    this.container = container;

    // TODO: this breaks rendering in Cloud9 with multiple ace instances
//    // Imports CSS once per DOM document ('ace_editor' serves as an identifier).
//    dom.importCssString(editorCss, "ace_editor", container.ownerDocument);
    
    // in IE <= 9 the native cursor always shines through
    this.$keepTextAreaAtCursor = !useragent.isIE;

    dom.addCssClass(container, "ace_editor");

    this.setTheme(theme);

    this.$gutter = dom.createElement("div");
    this.$gutter.className = "ace_gutter";
    this.container.appendChild(this.$gutter);

    this.scroller = dom.createElement("div");
    this.scroller.className = "ace_scroller";
    this.container.appendChild(this.scroller);

    this.content = dom.createElement("div");
    this.content.className = "ace_content";
    this.scroller.appendChild(this.content);

    this.setHighlightGutterLine(true);
    this.$gutterLayer = new GutterLayer(this.$gutter);
    this.$gutterLayer.on("changeGutterWidth", this.onResize.bind(this, true));
    this.setFadeFoldWidgets(true);

    this.$markerBack = new MarkerLayer(this.content);

    var textLayer = this.$textLayer = new TextLayer(this.content);
    this.canvas = textLayer.element;

    this.$markerFront = new MarkerLayer(this.content);

    this.characterWidth = textLayer.getCharacterWidth();
    this.lineHeight = textLayer.getLineHeight();

    this.$cursorLayer = new CursorLayer(this.content);
    this.$cursorPadding = 8;

    // Indicates whether the horizontal scrollbar is visible
    this.$horizScroll = false;
    this.$horizScrollAlwaysVisible = false;

    this.$animatedScroll = false;

    this.scrollBar = new ScrollBar(container);
    this.scrollBar.addEventListener("scroll", function(e) {
        if (!_self.$inScrollAnimation)
            _self.session.setScrollTop(e.data);
    });

    this.scrollTop = 0;
    this.scrollLeft = 0;

    event.addListener(this.scroller, "scroll", function() {
        var scrollLeft = _self.scroller.scrollLeft;
        _self.scrollLeft = scrollLeft;
        _self.session.setScrollLeft(scrollLeft);

        _self.scroller.className = scrollLeft == 0
            ? "ace_scroller"
            : "ace_scroller horscroll";
    });

    this.cursorPos = {
        row : 0,
        column : 0
    };

    this.$textLayer.addEventListener("changeCharacterSize", function() {
        _self.characterWidth = textLayer.getCharacterWidth();
        _self.lineHeight = textLayer.getLineHeight();
        _self.$updatePrintMargin();
        _self.onResize(true);

        _self.$loop.schedule(_self.CHANGE_FULL);
    });

    this.$size = {
        width: 0,
        height: 0,
        scrollerHeight: 0,
        scrollerWidth: 0
    };

    this.layerConfig = {
        width : 1,
        padding : 0,
        firstRow : 0,
        firstRowScreen: 0,
        lastRow : 0,
        lineHeight : 1,
        characterWidth : 1,
        minHeight : 1,
        maxHeight : 1,
        offset : 0,
        height : 1
    };

    this.$loop = new RenderLoop(
        this.$renderChanges.bind(this),
        this.container.ownerDocument.defaultView
    );
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
    this.CHANGE_MARKER_BACK = 128;
    this.CHANGE_MARKER_FRONT = 256;
    this.CHANGE_FULL = 512;
    this.CHANGE_H_SCROLL = 1024;

    oop.implement(this, EventEmitter);

    /**
    * VirtualRenderer.setSession(session) -> Void
    * 
    * Associates an [[EditSession `EditSession`]].
    **/
    this.setSession = function(session) {
        this.session = session;
        
        this.scroller.className = "ace_scroller";
        
        this.$cursorLayer.setSession(session);
        this.$markerBack.setSession(session);
        this.$markerFront.setSession(session);
        this.$gutterLayer.setSession(session);
        this.$textLayer.setSession(session);
        this.$loop.schedule(this.CHANGE_FULL);
        
    };

    /**
    * VirtualRenderer.updateLines(firstRow, lastRow) -> Void
    * - firstRow (Number): The first row to update
    * - lastRow (Number): The last row to update
    *
    * Triggers a partial update of the text, from the range given by the two parameters.
    **/
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
    * VirtualRenderer.updateText() -> Void
    *
    * Triggers a full update of the text, for all the rows.
    **/
    this.updateText = function() {
        this.$loop.schedule(this.CHANGE_TEXT);
    };

    /**
    * VirtualRenderer.updateFull() -> Void
    *
    * Triggers a full update of all the layers, for all the rows.
    **/
    this.updateFull = function() {
        this.$loop.schedule(this.CHANGE_FULL);
    };

    /**
    * VirtualRenderer.updateFontSize() -> Void
    *
    * Updates the font size.
    **/
    this.updateFontSize = function() {
        this.$textLayer.checkForSizeChanges();
    };

    /**
    * VirtualRenderer.onResize(force) -> Void
    * - force (Boolean): If `true`, recomputes the size, even if the height and width haven't changed
    *
    * [Triggers a resize of the editor.]{: #VirtualRenderer.onResize}
    **/
    this.onResize = function(force) {
        var changes = this.CHANGE_SIZE;
        var size = this.$size;

        var height = dom.getInnerHeight(this.container);
        if (force || size.height != height) {
            size.height = height;

            this.scroller.style.height = height + "px";
            size.scrollerHeight = this.scroller.clientHeight;
            this.scrollBar.setHeight(size.scrollerHeight);

            if (this.session) {
                this.session.setScrollTop(this.getScrollTop());
                changes = changes | this.CHANGE_FULL;
            }
        }

        var width = dom.getInnerWidth(this.container);
        if (force || size.width != width) {
            size.width = width;

            var gutterWidth = this.showGutter ? this.$gutter.offsetWidth : 0;
            this.scroller.style.left = gutterWidth + "px";
            size.scrollerWidth = Math.max(0, width - gutterWidth - this.scrollBar.getWidth());
            this.scroller.style.width = size.scrollerWidth + "px";

            if (this.session.getUseWrapMode() && this.adjustWrapLimit() || force)
                changes = changes | this.CHANGE_FULL;
        }

        this.$loop.schedule(changes);
    };

    /**
    * VirtualRenderer.adjustWrapLimit() -> Void
    *
    * Adjusts the wrap limit, which is the number of characters that can fit within the width of the edit area on screen.
    **/
    this.adjustWrapLimit = function() {
        var availableWidth = this.$size.scrollerWidth - this.$padding * 2;
        var limit = Math.floor(availableWidth / this.characterWidth);
        return this.session.adjustWrapLimit(limit);
    };

    /**
    * VirtualRenderer.setAnimatedScroll(shouldAnimate) -> Void
    * - shouldAnimate (Boolean): Set to `true` to show animated scrolls
    *
    * Identifies whether you want to have an animated scroll or not.
    *
    **/
    this.setAnimatedScroll = function(shouldAnimate){
        this.$animatedScroll = shouldAnimate;
    };

    /**
    * VirtualRenderer.getAnimatedScroll() -> Boolean
    *
    * Returns whether an animated scroll happens or not.
    **/
    this.getAnimatedScroll = function() {
        return this.$animatedScroll;
    };

    /**
    * VirtualRenderer.setShowInvisibles(showInvisibles) -> Void
    * - showInvisibles (Boolean): Set to `true` to show invisibles
    *
    * Identifies whether you want to show invisible characters or not.
    *
    **/
    this.setShowInvisibles = function(showInvisibles) {
        if (this.$textLayer.setShowInvisibles(showInvisibles))
            this.$loop.schedule(this.CHANGE_TEXT);
    };

    /**
    * VirtualRenderer.getShowInvisibles() -> Boolean
    *
    * Returns whether invisible characters are being shown or not.
    **/
    this.getShowInvisibles = function() {
        return this.$textLayer.showInvisibles;
    };

    this.$showPrintMargin = true;

    /**
    * VirtualRenderer.setShowPrintMargin(showPrintMargin)
    * - showPrintMargin (Boolean): Set to `true` to show the print margin
    *
    * Identifies whether you want to show the print margin or not.
    *
    **/
    this.setShowPrintMargin = function(showPrintMargin) {
        this.$showPrintMargin = showPrintMargin;
        this.$updatePrintMargin();
    };

    /**
    * VirtualRenderer.getShowPrintMargin() -> Boolean
    *
    * Returns whetherthe print margin is being shown or not.
    **/
    this.getShowPrintMargin = function() {
        return this.$showPrintMargin;
    };

    this.$printMarginColumn = 80;

    /**
    * VirtualRenderer.setPrintMarginColumn(showPrintMargin)
    * - showPrintMargin (Boolean): Set to `true` to show the print margin column
    *
    * Identifies whether you want to show the print margin column or not.
    *
    **/
    this.setPrintMarginColumn = function(showPrintMargin) {
        this.$printMarginColumn = showPrintMargin;
        this.$updatePrintMargin();
    };

    /**
    * VirtualRenderer.getPrintMarginColumn() -> Boolean
    *
    * Returns whether the print margin column is being shown or not.
    **/
    this.getPrintMarginColumn = function() {
        return this.$printMarginColumn;
    };

    /**
    * VirtualRenderer.getShowGutter() -> Boolean
    *
    * Returns `true` if the gutter is being shown.
    **/
    this.getShowGutter = function(){
        return this.showGutter;
    };

    /**
    * VirtualRenderer.setShowGutter(show) -> Void
    * - show (Boolean): Set to `true` to show the gutter
    *
    * Identifies whether you want to show the gutter or not.
    **/
    this.setShowGutter = function(show){
        if(this.showGutter === show)
            return;
        this.$gutter.style.display = show ? "block" : "none";
        this.showGutter = show;
        this.onResize(true);
    };

    this.getFadeFoldWidgets = function(){
        return dom.hasCssClass(this.$gutter, "ace_fade-fold-widgets");
    };

    this.setFadeFoldWidgets = function(show) {
        if (show)
            dom.addCssClass(this.$gutter, "ace_fade-fold-widgets");
        else
            dom.removeCssClass(this.$gutter, "ace_fade-fold-widgets");
    };

    this.$highlightGutterLine = false;
    this.setHighlightGutterLine = function(shouldHighlight) {
        if (this.$highlightGutterLine == shouldHighlight)
            return;
        this.$highlightGutterLine = shouldHighlight;
        
        
        if (!this.$gutterLineHighlight) {
            this.$gutterLineHighlight = dom.createElement("div");
            this.$gutterLineHighlight.className = "ace_gutter_active_line";
            this.$gutter.appendChild(this.$gutterLineHighlight);
            return;
        }

        this.$gutterLineHighlight.style.display = shouldHighlight ? "" : "none";
        this.$updateGutterLineHighlight();
    };

    this.getHighlightGutterLine = function() {
        return this.$highlightGutterLine;
    };

    this.$updateGutterLineHighlight = function() {
        this.$gutterLineHighlight.style.top = this.$cursorLayer.$pixelPos.top + "px";
        this.$gutterLineHighlight.style.height = this.layerConfig.lineHeight + "px";
    };
    
    this.$updatePrintMargin = function() {
        var containerEl;

        if (!this.$showPrintMargin && !this.$printMarginEl)
            return;

        if (!this.$printMarginEl) {
            containerEl = dom.createElement("div");
            containerEl.className = "ace_print_margin_layer";
            this.$printMarginEl = dom.createElement("div");
            this.$printMarginEl.className = "ace_print_margin";
            containerEl.appendChild(this.$printMarginEl);
            this.content.insertBefore(containerEl, this.$textLayer.element);
        }

        var style = this.$printMarginEl.style;
        style.left = ((this.characterWidth * this.$printMarginColumn) + this.$padding) + "px";
        style.visibility = this.$showPrintMargin ? "visible" : "hidden";
    };

    /**
    * VirtualRenderer.getContainerElement() -> DOMElement
    *
    * Returns the root element containing this renderer.
    **/
    this.getContainerElement = function() {
        return this.container;
    };

    /**
    * VirtualRenderer.getMouseEventTarget() -> DOMElement
    *
    * Returns the element that the mouse events are attached to
    **/
    this.getMouseEventTarget = function() {
        return this.content;
    };

    /**
    * VirtualRenderer.getTextAreaContainer() -> DOMElement
    *
    * Returns the element to which the hidden text area is added.
    **/
    this.getTextAreaContainer = function() {
        return this.container;
    };

    // move text input over the cursor
    // this is required for iOS and IME
    this.$moveTextAreaToCursor = function() {
        if (!this.$keepTextAreaAtCursor)
            return;

        var posTop = this.$cursorLayer.$pixelPos.top;
        var posLeft = this.$cursorLayer.$pixelPos.left;
        posTop -= this.layerConfig.offset;

        if (posTop < 0 || posTop > this.layerConfig.height)
            return;

        posLeft += (this.showGutter ? this.$gutterLayer.gutterWidth : 0) - this.scrollLeft;
        var bounds = this.container.getBoundingClientRect();
        this.textarea.style.left = (bounds.left + posLeft) + "px";
        this.textarea.style.top = (bounds.top + posTop) + "px";
    };

    /**
    * VirtualRenderer.getFirstVisibleRow() -> Number
    *
    * [Returns the index of the first visible row.]{: #VirtualRenderer.getFirstVisibleRow}
    **/
    this.getFirstVisibleRow = function() {
        return this.layerConfig.firstRow;
    };

    /**
    * VirtualRenderer.getFirstFullyVisibleRow() -> Number
    *
    * Returns the index of the first fully visible row. "Fully" here means that the characters in the row are not truncated; that the top and the bottom of the row are on the screen.
    **/
    this.getFirstFullyVisibleRow = function() {
        return this.layerConfig.firstRow + (this.layerConfig.offset === 0 ? 0 : 1);
    };

    /**
    * VirtualRenderer.getLastFullyVisibleRow() -> Number
    *
    * Returns the index of the last fully visible row. "Fully" here means that the characters in the row are not truncated; that the top and the bottom of the row are on the screen.
    **/
    this.getLastFullyVisibleRow = function() {
        var flint = Math.floor((this.layerConfig.height + this.layerConfig.offset) / this.layerConfig.lineHeight);
        return this.layerConfig.firstRow - 1 + flint;
    };

    /**
    * VirtualRenderer.getLastVisibleRow() -> Number
    *
    * [Returns the index of the last visible row.]{: #VirtualRenderer.getLastVisibleRow}
    **/
    this.getLastVisibleRow = function() {
        return this.layerConfig.lastRow;
    };

    this.$padding = null;

    /**
    * VirtualRenderer.setPadding(padding) -> Void
    * - padding (Number): A new padding value (in pixels)
    * 
    * Sets the padding for all the layers.
    *
    **/
    this.setPadding = function(padding) {
        this.$padding = padding;
        this.$textLayer.setPadding(padding);
        this.$cursorLayer.setPadding(padding);
        this.$markerFront.setPadding(padding);
        this.$markerBack.setPadding(padding);
        this.$loop.schedule(this.CHANGE_FULL);
        this.$updatePrintMargin();
    };

    /**
    * VirtualRenderer.getHScrollBarAlwaysVisible() -> Boolean
    *
    * Returns whether the horizontal scrollbar is set to be always visible.
    **/
    this.getHScrollBarAlwaysVisible = function() {
        return this.$horizScrollAlwaysVisible;
    };

    /**
    * VirtualRenderer.setHScrollBarAlwaysVisible(alwaysVisible) -> Void
    * - alwaysVisible (Boolean): Set to `true` to make the horizontal scroll bar visible
    *
    * Identifies whether you want to show the horizontal scrollbar or not. 
    **/
    this.setHScrollBarAlwaysVisible = function(alwaysVisible) {
        if (this.$horizScrollAlwaysVisible != alwaysVisible) {
            this.$horizScrollAlwaysVisible = alwaysVisible;
            if (!this.$horizScrollAlwaysVisible || !this.$horizScroll)
                this.$loop.schedule(this.CHANGE_SCROLL);
        }
    };

    this.$updateScrollBar = function() {
        this.scrollBar.setInnerHeight(this.layerConfig.maxHeight);
        this.scrollBar.setScrollTop(this.scrollTop);
    };

    this.$renderChanges = function(changes) {
        if (!changes || !this.session || !this.container.offsetWidth)
            return;

        // text, scrolling and resize changes can cause the view port size to change
        if (changes & this.CHANGE_FULL ||
            changes & this.CHANGE_SIZE ||
            changes & this.CHANGE_TEXT ||
            changes & this.CHANGE_LINES ||
            changes & this.CHANGE_SCROLL
        )
            this.$computeLayerConfig();

        // horizontal scrolling
        if (changes & this.CHANGE_H_SCROLL) {
            this.scroller.scrollLeft = this.scrollLeft;

            // read the value after writing it since the value might get clipped
            var scrollLeft = this.scroller.scrollLeft;
            this.scrollLeft = scrollLeft;
            this.session.setScrollLeft(scrollLeft);
        }

        // full
        if (changes & this.CHANGE_FULL) {
            this.$textLayer.checkForSizeChanges();
            // update scrollbar first to not lose scroll position when gutter calls resize
            this.$updateScrollBar();
            this.$textLayer.update(this.layerConfig);
            if (this.showGutter)
                this.$gutterLayer.update(this.layerConfig);
            this.$markerBack.update(this.layerConfig);
            this.$markerFront.update(this.layerConfig);
            this.$cursorLayer.update(this.layerConfig);
            this.$moveTextAreaToCursor();
            this.$highlightGutterLine && this.$updateGutterLineHighlight();
            return;
        }

        // scrolling
        if (changes & this.CHANGE_SCROLL) {
            this.$updateScrollBar();
            if (changes & this.CHANGE_TEXT || changes & this.CHANGE_LINES)
                this.$textLayer.update(this.layerConfig);
            else
                this.$textLayer.scrollLines(this.layerConfig);

            if (this.showGutter)
                this.$gutterLayer.update(this.layerConfig);
            this.$markerBack.update(this.layerConfig);
            this.$markerFront.update(this.layerConfig);
            this.$cursorLayer.update(this.layerConfig);
            this.$moveTextAreaToCursor();
            this.$highlightGutterLine && this.$updateGutterLineHighlight();
            return;
        }

        if (changes & this.CHANGE_TEXT) {
            this.$textLayer.update(this.layerConfig);
            if (this.showGutter)
                this.$gutterLayer.update(this.layerConfig);
        }
        else if (changes & this.CHANGE_LINES) {
            if (this.$updateLines()) {
                this.$updateScrollBar();
                if (this.showGutter)
                    this.$gutterLayer.update(this.layerConfig);
            }
        } else if (changes & this.CHANGE_GUTTER) {
            if (this.showGutter)
                this.$gutterLayer.update(this.layerConfig);
        }

        if (changes & this.CHANGE_CURSOR) {
            this.$cursorLayer.update(this.layerConfig);
            this.$moveTextAreaToCursor();
            this.$highlightGutterLine && this.$updateGutterLineHighlight();
        }

        if (changes & (this.CHANGE_MARKER | this.CHANGE_MARKER_FRONT)) {
            this.$markerFront.update(this.layerConfig);
        }

        if (changes & (this.CHANGE_MARKER | this.CHANGE_MARKER_BACK)) {
            this.$markerBack.update(this.layerConfig);
        }

        if (changes & this.CHANGE_SIZE)
            this.$updateScrollBar();
    };

    this.$computeLayerConfig = function() {
        var session = this.session;

        var offset = this.scrollTop % this.lineHeight;
        var minHeight = this.$size.scrollerHeight + this.lineHeight;

        var longestLine = this.$getLongestLine();

        var horizScroll = this.$horizScrollAlwaysVisible || this.$size.scrollerWidth - longestLine < 0;
        var horizScrollChanged = this.$horizScroll !== horizScroll;
        this.$horizScroll = horizScroll;
        if (horizScrollChanged) {
            this.scroller.style.overflowX = horizScroll ? "scroll" : "hidden";
            // when we hide scrollbar scroll event isn't emited
            // leaving session with wrong scrollLeft value
            if (!horizScroll)
                this.session.setScrollLeft(0);
        }
        var maxHeight = this.session.getScreenLength() * this.lineHeight;
        this.session.setScrollTop(Math.max(0, Math.min(this.scrollTop, maxHeight - this.$size.scrollerHeight)));

        var lineCount = Math.ceil(minHeight / this.lineHeight) - 1;
        var firstRow = Math.max(0, Math.round((this.scrollTop - offset) / this.lineHeight));
        var lastRow = firstRow + lineCount;

        // Map lines on the screen to lines in the document.
        var firstRowScreen, firstRowHeight;
        var lineHeight = { lineHeight: this.lineHeight };
        firstRow = session.screenToDocumentRow(firstRow, 0);

        // Check if firstRow is inside of a foldLine. If true, then use the first
        // row of the foldLine.
        var foldLine = session.getFoldLine(firstRow);
        if (foldLine) {
            firstRow = foldLine.start.row;
        }

        firstRowScreen = session.documentToScreenRow(firstRow, 0);
        firstRowHeight = session.getRowHeight(lineHeight, firstRow);

        lastRow = Math.min(session.screenToDocumentRow(lastRow, 0), session.getLength() - 1);
        minHeight = this.$size.scrollerHeight + session.getRowHeight(lineHeight, lastRow)+
                                                firstRowHeight;

        offset = this.scrollTop - firstRowScreen * this.lineHeight;

        this.layerConfig = {
            width : longestLine,
            padding : this.$padding,
            firstRow : firstRow,
            firstRowScreen: firstRowScreen,
            lastRow : lastRow,
            lineHeight : this.lineHeight,
            characterWidth : this.characterWidth,
            minHeight : minHeight,
            maxHeight : maxHeight,
            offset : offset,
            height : this.$size.scrollerHeight
        };

        // For debugging.
        // console.log(JSON.stringify(this.layerConfig));

        this.$gutter.style.marginTop = (-offset) + "px";
        this.content.style.marginTop = (-offset) + "px";
        this.content.style.width = longestLine + 2 * this.$padding + "px";
        this.content.style.height = minHeight + "px";

        // Horizontal scrollbar visibility may have changed, which changes
        // the client height of the scroller
        if (horizScrollChanged)
            this.onResize(true);
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
            if (this.showGutter)
                this.$gutterLayer.update(layerConfig);
            this.$textLayer.update(layerConfig);
            return;
        }

        // else update only the changed rows
        this.$textLayer.updateLines(layerConfig, firstRow, lastRow);
        return true;
    };

    this.$getLongestLine = function() {
        var charCount = this.session.getScreenWidth();
        if (this.$textLayer.showInvisibles)
            charCount += 1;

        return Math.max(this.$size.scrollerWidth - 2 * this.$padding, Math.round(charCount * this.characterWidth));
    };

    /**
    * VirtualRenderer.updateFrontMarkers() -> Void
    *
    * Schedules an update to all the front markers in the document.
    **/
    this.updateFrontMarkers = function() {
        this.$markerFront.setMarkers(this.session.getMarkers(true));
        this.$loop.schedule(this.CHANGE_MARKER_FRONT);
    };

    /**
    * VirtualRenderer.updateBackMarkers() -> Void
    *
    * Schedules an update to all the back markers in the document.
    **/
    this.updateBackMarkers = function() {
        this.$markerBack.setMarkers(this.session.getMarkers());
        this.$loop.schedule(this.CHANGE_MARKER_BACK);
    };

    /**
    * VirtualRenderer.addGutterDecoration(row, className) -> Void
    * - row (Number): The row number
    * - className (String): The class to add
    *
    * Adds `className` to the `row`, to be used for CSS stylings and whatnot.
    **/
    this.addGutterDecoration = function(row, className){
        this.$gutterLayer.addGutterDecoration(row, className);
        this.$loop.schedule(this.CHANGE_GUTTER);
    };

    /**
    * VirtualRenderer.removeGutterDecoration(row, className)-> Void
    * - row (Number): The row number
    * - className (String): The class to add
    *
    * Removes `className` from the `row`.
    **/
    this.removeGutterDecoration = function(row, className){
        this.$gutterLayer.removeGutterDecoration(row, className);
        this.$loop.schedule(this.CHANGE_GUTTER);
    };

    /**
    * VirtualRenderer.setBreakpoints(rows) -> Void
    * - rows (Array): An array containg row numbers
    *
    * Sets a breakpoint for every row number indicated on `rows`.
    **/
    this.setBreakpoints = function(rows) {
        this.$gutterLayer.setBreakpoints(rows);
        this.$loop.schedule(this.CHANGE_GUTTER);
    };

    /**
    * VirtualRenderer.setAnnotations(annotations) -> Void
    * - annotations (Array): An array containing annotations
    *
    * Sets annotations for the gutter.
    **/
    this.setAnnotations = function(annotations) {
        this.$gutterLayer.setAnnotations(annotations);
        this.$loop.schedule(this.CHANGE_GUTTER);
    };

    /**
    * VirtualRenderer.updateCursor() -> Void
    *
    * Updates the cursor icon.
    **/
    this.updateCursor = function() {
        this.$loop.schedule(this.CHANGE_CURSOR);
    };

    /**
    * VirtualRenderer.hideCursor() -> Void
    *
    * Hides the cursor icon.
    **/
    this.hideCursor = function() {
        this.$cursorLayer.hideCursor();
    };

    /**
    * VirtualRenderer.showCursor() -> Void
    *
    * Shows the cursor icon.
    **/
    this.showCursor = function() {
        this.$cursorLayer.showCursor();
    };

    this.scrollSelectionIntoView = function(anchor, lead, offset) {
        // first scroll anchor into view then scroll lead into view
        this.scrollCursorIntoView(anchor, offset);
        this.scrollCursorIntoView(lead, offset);
    };

    /**
    * VirtualRenderer.scrollCursorIntoView(cursor, offset) -> Void
    *
    * Scrolls the cursor into the first visibile area of the editor
    **/
    this.scrollCursorIntoView = function(cursor, offset) {
        // the editor is not visible
        if (this.$size.scrollerHeight === 0)
            return;

        var pos = this.$cursorLayer.getPixelPosition(cursor);

        var left = pos.left;
        var top = pos.top;

        if (this.scrollTop > top) {
            if (offset)
                top -= offset * this.$size.scrollerHeight;
            this.session.setScrollTop(top);
        } else if (this.scrollTop + this.$size.scrollerHeight < top + this.lineHeight) {
            if (offset)
                top += offset * this.$size.scrollerHeight;
            this.session.setScrollTop(top + this.lineHeight - this.$size.scrollerHeight);
        }

        var scrollLeft = this.scrollLeft;

        if (scrollLeft > left) {
            if (left < this.$padding + 2 * this.layerConfig.characterWidth)
                left = 0;
            this.session.setScrollLeft(left);
        } else if (scrollLeft + this.$size.scrollerWidth < left + this.characterWidth) {
            this.session.setScrollLeft(Math.round(left + this.characterWidth - this.$size.scrollerWidth));
        }
    };

    /** related to: EditSession.getScrollTop
    * VirtualRenderer.getScrollTop() -> Number
    *
    * {:EditSession.getScrollTop}
    **/
    this.getScrollTop = function() {
        return this.session.getScrollTop();
    };

    /** related to: EditSession.getScrollLeft
    * VirtualRenderer.getScrollLeft() -> Number
    *
    * {:EditSession.getScrollLeft}
    **/
    this.getScrollLeft = function() {
        return this.session.getScrollLeft();
    };

    /**
    * VirtualRenderer.getScrollTopRow() -> Number
    *
    * Returns the first visible row, regardless of whether it's fully visible or not.
    **/
    this.getScrollTopRow = function() {
        return this.scrollTop / this.lineHeight;
    };

    /**
    * VirtualRenderer.getScrollBottomRow() -> Number
    *
    * Returns the last visible row, regardless of whether it's fully visible or not.
    **/
    this.getScrollBottomRow = function() {
        return Math.max(0, Math.floor((this.scrollTop + this.$size.scrollerHeight) / this.lineHeight) - 1);
    };

    /** related to: EditSession.setScrollTop
    * VirtualRenderer.scrollToRow(row) -> Void
    * - row (Number): A row id
    *
    * Gracefully scrolls the top of the editor to the row indicated.
    **/
    this.scrollToRow = function(row) {
        this.session.setScrollTop(row * this.lineHeight);
    };

    this.STEPS = 8;
    this.$calcSteps = function(fromValue, toValue){
        var i = 0;
        var l = this.STEPS;
        var steps = [];

        var func  = function(t, x_min, dx) {
            return dx * (Math.pow(t - 1, 3) + 1) + x_min;
        };

        for (i = 0; i < l; ++i)
            steps.push(func(i / this.STEPS, fromValue, toValue - fromValue));

        return steps;
    };

    /** 
    * VirtualRenderer.scrollToLine(line, center, animate, callback) -> Void
    * - line (Number): A line number
    * - center (Boolean): If `true`, centers the editor the to indicated line
    * - animate (Boolean): If `true` animates scrolling
    * - callback (Function): Function to be called after the animation has finished
    * 
    * Gracefully scrolls the editor to the row indicated.
    **/
    this.scrollToLine = function(line, center, animate, callback) {
        var pos = this.$cursorLayer.getPixelPosition({row: line, column: 0});
        var offset = pos.top;
        if (center)
            offset -= this.$size.scrollerHeight / 2;

        var initialScroll = this.scrollTop;
        this.session.setScrollTop(offset);
        if (animate !== false)
            this.animateScrolling(initialScroll, callback);
    };

    this.animateScrolling = function(fromValue, callback) {
        var toValue = this.scrollTop;
        if (this.$animatedScroll && Math.abs(fromValue - toValue) < 100000) {
            var _self = this;
            var steps = _self.$calcSteps(fromValue, toValue);
            this.$inScrollAnimation = true;
            
            clearInterval(this.$timer);

            _self.session.setScrollTop(steps.shift());
            this.$timer = setInterval(function() {
                if (steps.length) {
                    _self.session.setScrollTop(steps.shift());
                    // trick session to think it's already scrolled to not loose toValue
                    _self.session.$scrollTop = toValue;
                } else {
                    this.$inScrollAnimation = false;
                    clearInterval(_self.$timer);
                    
                    _self.session.$scrollTop = -1;
                    _self.session.setScrollTop(toValue);
                     callback &&  callback();
                }
            }, 10);
        }
    };
    
    /**
    * VirtualRenderer.scrollToY(scrollTop) -> Number
    * - scrollTop (Number): The position to scroll to
    *
    * Scrolls the editor to the y pixel indicated.
    *
    **/
    this.scrollToY = function(scrollTop) {
        // after calling scrollBar.setScrollTop
        // scrollbar sends us event with same scrollTop. ignore it
        if (this.scrollTop !== scrollTop) {
            this.$loop.schedule(this.CHANGE_SCROLL);
            this.scrollTop = scrollTop;
        }
    };

    /**
    * VirtualRenderer.scrollToX(scrollLeft) -> Number
    * - scrollLeft (Number): The position to scroll to
    *
    * Scrolls the editor to the x pixel indicated.
    *
    **/
    this.scrollToX = function(scrollLeft) {
        if (scrollLeft <= this.$padding)
            scrollLeft = 0;

        if (this.scrollLeft !== scrollLeft)
            this.scrollLeft = scrollLeft;
        this.$loop.schedule(this.CHANGE_H_SCROLL);
    };

    /**
    * VirtualRenderer.scrollBy(deltaX, deltaY) -> Void
    * - deltaX (Number): The x value to scroll by
    * - deltaY (Number): The y value to scroll by
    *
    * Scrolls the editor across both x- and y-axes.
    **/
    this.scrollBy = function(deltaX, deltaY) {
        deltaY && this.session.setScrollTop(this.session.getScrollTop() + deltaY);
        deltaX && this.session.setScrollLeft(this.session.getScrollLeft() + deltaX);
    };

    /**
    * VirtualRenderer.isScrollableBy(deltaX, deltaY) -> Boolean
    * - deltaX (Number): The x value to scroll by
    * - deltaY (Number): The y value to scroll by
    *
    * Returns `true` if you can still scroll by either parameter; in other words, you haven't reached the end of the file or line.
    **/
    this.isScrollableBy = function(deltaX, deltaY) {
        if (deltaY < 0 && this.session.getScrollTop() > 0)
           return true;
        if (deltaY > 0 && this.session.getScrollTop() + this.$size.scrollerHeight < this.layerConfig.maxHeight)
           return true;
        // todo: handle horizontal scrolling
    };

    this.pixelToScreenCoordinates = function(x, y) {
        var canvasPos = this.scroller.getBoundingClientRect();

        var offset = (x + this.scrollLeft - canvasPos.left - this.$padding) / this.characterWidth;
        var row = Math.floor((y + this.scrollTop - canvasPos.top) / this.lineHeight);
        var col = Math.round(offset);

        return {row: row, column: col, side: offset - col > 0 ? 1 : -1};
    };

    this.screenToTextCoordinates = function(x, y) {
        var canvasPos = this.scroller.getBoundingClientRect();

        var col = Math.round(
            (x + this.scrollLeft - canvasPos.left - this.$padding) / this.characterWidth
        );
        var row = Math.floor(
            (y + this.scrollTop - canvasPos.top) / this.lineHeight
        );

        return this.session.screenToDocumentPosition(row, Math.max(col, 0));
    };

    /**
    * VirtualRenderer.textToScreenCoordinates(row, column) -> Object
    * - row (Number): The document row position
    * - column (Number): The document column position
    *
    * Returns an object containing the `pageX` and `pageY` coordinates of the document position.
    *
    *
    **/
    this.textToScreenCoordinates = function(row, column) {
        var canvasPos = this.scroller.getBoundingClientRect();
        var pos = this.session.documentToScreenPosition(row, column);

        var x = this.$padding + Math.round(pos.column * this.characterWidth);
        var y = pos.row * this.lineHeight;

        return {
            pageX: canvasPos.left + x - this.scrollLeft,
            pageY: canvasPos.top + y - this.scrollTop
        };
    };

    /**
    * VirtualRenderer.visualizeFocus() -> Void
    *
    * Focuses the current container.
    **/
    this.visualizeFocus = function() {
        dom.addCssClass(this.container, "ace_focus");
    };

    /**
    * VirtualRenderer.visualizeBlur() -> Void
    *
    * Blurs the current container.
    **/
    this.visualizeBlur = function() {
        dom.removeCssClass(this.container, "ace_focus");
    };

    /** internal, hide
    * VirtualRenderer.showComposition(position) -> Void
    * - position (Number):
    *
    **/
    this.showComposition = function(position) {
        if (!this.$composition) {
            this.$composition = dom.createElement("div");
            this.$composition.className = "ace_composition";
            this.content.appendChild(this.$composition);
        }

        this.$composition.innerHTML = "&#160;";

        var pos = this.$cursorLayer.getPixelPosition();
        var style = this.$composition.style;
        style.top = pos.top + "px";
        style.left = (pos.left + this.$padding) + "px";
        style.height = this.lineHeight + "px";

        this.hideCursor();
    };

    /**
    * VirtualRenderer.setCompositionText(text) -> Void
    * - text (String): A string of text to use
    *
    * Sets the inner text of the current composition to `text`.
    **/
    this.setCompositionText = function(text) {
        dom.setInnerText(this.$composition, text);
    };

    /**
    * VirtualRenderer.hideComposition() -> Void
    *
    * Hides the current composition.
    **/
    this.hideComposition = function() {
        this.showCursor();

        if (!this.$composition)
            return;

        var style = this.$composition.style;
        style.top = "-10000px";
        style.left = "-10000px";
    };

    this._loadTheme = function(name, callback) {
        if (!config.get("packaged"))
            return callback();

        var base = name.split("/").pop();
        var filename = config.get("themePath") + "/theme-" + base + config.get("suffix");
        net.loadScript(filename, callback);
    };

    /**
    * VirtualRenderer.setTheme(theme) -> Void
    * - theme (String): The path to a theme
    *
    * [Sets a new theme for the editor. `theme` should exist, and be a directory path, like `ace/theme/textmate`.]{: #VirtualRenderer.setTheme}
    **/
    this.setTheme = function(theme) {
        var _self = this;

        this.$themeValue = theme;
        if (!theme || typeof theme == "string") {
            var moduleName = theme || "ace/theme/textmate";

            var module;
            try {
                module = require(moduleName);
            } catch (e) {};
            if (module)
                return afterLoad(module);

            _self._loadTheme(moduleName, function() {
                require([moduleName], function(module) {
                    if (_self.$themeValue !== theme)
                        return;

                    afterLoad(module);
                });
            });
        } else {
            afterLoad(theme);
        }

        function afterLoad(theme) {
            dom.importCssString(
                theme.cssText,
                theme.cssClass,
                _self.container.ownerDocument
            );

            if (_self.$theme)
                dom.removeCssClass(_self.container, _self.$theme);

            _self.$theme = theme ? theme.cssClass : null;

            if (_self.$theme)
                dom.addCssClass(_self.container, _self.$theme);

            if (theme && theme.isDark)
                dom.addCssClass(_self.container, "ace_dark");
            else
                dom.removeCssClass(_self.container, "ace_dark");

            // force re-measure of the gutter width
            if (_self.$size) {
                _self.$size.width = 0;
                _self.onResize();
            }
        }
    };

    /**
    * VirtualRenderer.getTheme() -> String
    *
    * [Returns the path of the current theme.]{: #VirtualRenderer.getTheme}
    **/
    this.getTheme = function() {
        return this.$themeValue;
    };

    // Methods allows to add / remove CSS classnames to the editor element.
    // This feature can be used by plug-ins to provide a visual indication of
    // a certain mode that editor is in.

    /**
    * VirtualRenderer.setStyle(style) -> Void
    * - style (String): A class name
    *
    * [Adds a new class, `style`, to the editor.]{: #VirtualRenderer.setStyle}
    **/
    this.setStyle = function setStyle(style) {
      dom.addCssClass(this.container, style);
    };

    /**
    * VirtualRenderer.unsetStyle(style) -> Void
    * - style (String): A class name
    *
    * [Removes the class `style` from the editor.]{: #VirtualRenderer.unsetStyle}
    **/
    this.unsetStyle = function unsetStyle(style) {
      dom.removeCssClass(this.container, style);
    };

    /**
    * VirtualRenderer.destroy()
    *
    * Destroys the text and cursor layers for this renderer.
    **/
    this.destroy = function() {
        this.$textLayer.destroy();
        this.$cursorLayer.destroy();
    };

}).call(VirtualRenderer.prototype);

exports.VirtualRenderer = VirtualRenderer;
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
 *      Julian Viereck <julian DOT viereck AT gmail DOT com>
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

ace.define('ace/layer/gutter', ['require', 'exports', 'module' , 'ace/lib/dom', 'ace/lib/oop', 'ace/lib/event_emitter'], function(require, exports, module) {
"use strict";

var dom = require("../lib/dom");
var oop = require("../lib/oop");
var EventEmitter = require("../lib/event_emitter").EventEmitter;

var Gutter = function(parentEl) {
    this.element = dom.createElement("div");
    this.element.className = "ace_layer ace_gutter-layer";
    parentEl.appendChild(this.element);
    this.setShowFoldWidgets(this.$showFoldWidgets);
    
    this.gutterWidth = 0;

    this.$breakpoints = [];
    this.$annotations = [];
    this.$decorations = [];
};

(function() {

    oop.implement(this, EventEmitter);
    
    this.setSession = function(session) {
        this.session = session;
    };

    this.addGutterDecoration = function(row, className){
        if (!this.$decorations[row])
            this.$decorations[row] = "";
        this.$decorations[row] += " " + className;
    };

    this.removeGutterDecoration = function(row, className){
        this.$decorations[row] = this.$decorations[row].replace(" " + className, "");
    };

    this.setBreakpoints = function(rows) {
        this.$breakpoints = rows.concat();
    };

    this.setAnnotations = function(annotations) {
        // iterate over sparse array
        this.$annotations = [];
        for (var row in annotations) if (annotations.hasOwnProperty(row)) {
            var rowAnnotations = annotations[row];
            if (!rowAnnotations)
                continue;

            var rowInfo = this.$annotations[row] = {
                text: []
            };
            for (var i=0; i<rowAnnotations.length; i++) {
                var annotation = rowAnnotations[i];
                var annoText = annotation.text.replace(/"/g, "&quot;").replace(/'/g, "&#8217;").replace(/</, "&lt;");
                if (rowInfo.text.indexOf(annoText) === -1)
                    rowInfo.text.push(annoText);
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

        var emptyAnno = {className: "", text: []};
        var html = [];
        var i = config.firstRow;
        var lastRow = config.lastRow;
        var fold = this.session.getNextFoldLine(i);
        var foldStart = fold ? fold.start.row : Infinity;
        var foldWidgets = this.$showFoldWidgets && this.session.foldWidgets;

        while (true) {
            if(i > foldStart) {
                i = fold.end.row + 1;
                fold = this.session.getNextFoldLine(i, fold);
                foldStart = fold ?fold.start.row :Infinity;
            }
            if(i > lastRow)
                break;

            var annotation = this.$annotations[i] || emptyAnno;
            html.push("<div class='ace_gutter-cell",
                this.$decorations[i] || "",
                this.$breakpoints[i] ? " ace_breakpoint " : " ",
                annotation.className,
                "' title='", annotation.text.join("\n"),
                "' style='height:", config.lineHeight, "px;'>", (i+1));

            if (foldWidgets) {
                var c = foldWidgets[i];
                // check if cached value is invalidated and we need to recompute
                if (c == null)
                    c = foldWidgets[i] = this.session.getFoldWidget(i);
                if (c)
                    html.push(
                        "<span class='ace_fold-widget ", c,
                        c == "start" && i == foldStart && i < fold.end.row ? " closed" : " open",
                        "'></span>"
                    );
            }

            var wrappedRowLength = this.session.getRowLength(i) - 1;
            while (wrappedRowLength--) {
                html.push("</div><div class='ace_gutter-cell' style='height:", config.lineHeight, "px'>\xA6");
            }

            html.push("</div>");

            i++;
        }
        this.element = dom.setInnerHtml(this.element, html.join(""));
        this.element.style.height = config.minHeight + "px";
        
        var gutterWidth = this.element.offsetWidth;
        if (gutterWidth !== this.gutterWidth) {
            this.gutterWidth = gutterWidth;
            this._emit("changeGutterWidth", gutterWidth);
        }
    };

    this.$showFoldWidgets = true;
    this.setShowFoldWidgets = function(show) {
        if (show)
            dom.addCssClass(this.element, "ace_folding-enabled");
        else
            dom.removeCssClass(this.element, "ace_folding-enabled");

        this.$showFoldWidgets = show;
    };
    
    this.getShowFoldWidgets = function() {
        return this.$showFoldWidgets;
    };

}).call(Gutter.prototype);

exports.Gutter = Gutter;

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

ace.define('ace/layer/marker', ['require', 'exports', 'module' , 'ace/range', 'ace/lib/dom'], function(require, exports, module) {
"use strict";

var Range = require("../range").Range;
var dom = require("../lib/dom");

var Marker = function(parentEl) {
    this.element = dom.createElement("div");
    this.element.className = "ace_layer ace_marker-layer";
    parentEl.appendChild(this.element);
};

(function() {

    this.$padding = 0;

    this.setPadding = function(padding) {
        this.$padding = padding;
    };
    this.setSession = function(session) {
        this.session = session;
    };
    
    this.setMarkers = function(markers) {
        this.markers = markers;
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
            if (marker.renderer) {
                var top = this.$getTop(range.start.row, config);
                var left = Math.round(
                    this.$padding + range.start.column * config.characterWidth
                );
                marker.renderer(html, range, left, top, config);
            }
            else if (range.isMultiLine()) {
                if (marker.type == "text") {
                    this.drawTextMarker(html, range, marker.clazz, config);
                } else {
                    this.drawMultiLineMarker(
                        html, range, marker.clazz, config,
                        marker.type
                    );
                }
            }
            else {
                this.drawSingleLineMarker(
                    html, range, marker.clazz + " start", config,
                    null, marker.type
                );
            }
        }
        this.element = dom.setInnerHtml(this.element, html.join(""));
    };

    this.$getTop = function(row, layerConfig) {
        return (row - layerConfig.firstRowScreen) * layerConfig.lineHeight;
    };

    // Draws a marker, which spans a range of text on multiple lines 
    this.drawTextMarker = function(stringBuilder, range, clazz, layerConfig) {
        // selection start
        var row = range.start.row;

        var lineRange = new Range(
            row, range.start.column,
            row, this.session.getScreenLastRowColumn(row)
        );
        this.drawSingleLineMarker(stringBuilder, lineRange, clazz + " start", layerConfig, 1, "text");

        // selection end
        row = range.end.row;
        lineRange = new Range(row, 0, row, range.end.column);
        this.drawSingleLineMarker(stringBuilder, lineRange, clazz, layerConfig, 0, "text");

        for (row = range.start.row + 1; row < range.end.row; row++) {
            lineRange.start.row = row;
            lineRange.end.row = row;
            lineRange.end.column = this.session.getScreenLastRowColumn(row);
            this.drawSingleLineMarker(stringBuilder, lineRange, clazz, layerConfig, 1, "text");
        }
    };

     // Draws a multi line marker, where lines span the full width
     this.drawMultiLineMarker = function(stringBuilder, range, clazz, layerConfig, type) {
        var padding = type === "background" ? 0 : this.$padding;
        var layerWidth = layerConfig.width + 2 * this.$padding - padding;
        // from selection start to the end of the line
        var height = layerConfig.lineHeight;
        var width = Math.round(layerWidth - (range.start.column * layerConfig.characterWidth));
        var top = this.$getTop(range.start.row, layerConfig);
        var left = Math.round(
            padding + range.start.column * layerConfig.characterWidth
        );

        stringBuilder.push(
            "<div class='", clazz, " start' style='",
            "height:", height, "px;",
            "width:", width, "px;",
            "top:", top, "px;",
            "left:", left, "px;'></div>"
        );

        // from start of the last line to the selection end
        top = this.$getTop(range.end.row, layerConfig);
        width = Math.round(range.end.column * layerConfig.characterWidth);

        stringBuilder.push(
            "<div class='", clazz, "' style='",
            "height:", height, "px;",
            "width:", width, "px;",
            "top:", top, "px;",
            "left:", padding, "px;'></div>"
        );

        // all the complete lines
        height = (range.end.row - range.start.row - 1) * layerConfig.lineHeight;
        if (height < 0)
            return;
        top = this.$getTop(range.start.row + 1, layerConfig);

        stringBuilder.push(
            "<div class='", clazz, "' style='",
            "height:", height, "px;",
            "width:", layerWidth, "px;",
            "top:", top, "px;",
            "left:", padding, "px;'></div>"
        );
    };

    // Draws a marker which covers part or whole width of a single screen line
    this.drawSingleLineMarker = function(stringBuilder, range, clazz, layerConfig, extraLength, type) {
        var padding = type === "background" ? 0 : this.$padding;
        var height = layerConfig.lineHeight;

        if (type === "background")
            var width = layerConfig.width;
        else
            width = Math.round((range.end.column + (extraLength || 0) - range.start.column) * layerConfig.characterWidth);

        var top = this.$getTop(range.start.row, layerConfig);
        var left = Math.round(
            padding + range.start.column * layerConfig.characterWidth
        );

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
 *      Julian Viereck <julian DOT viereck AT gmail DOT com>
 *      Mihai Sucan <mihai.sucan@gmail.com>
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

ace.define('ace/layer/text', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/lib/dom', 'ace/lib/lang', 'ace/lib/useragent', 'ace/lib/event_emitter'], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var dom = require("../lib/dom");
var lang = require("../lib/lang");
var useragent = require("../lib/useragent");
var EventEmitter = require("../lib/event_emitter").EventEmitter;

var Text = function(parentEl) {
    this.element = dom.createElement("div");
    this.element.className = "ace_layer ace_text-layer";
    parentEl.appendChild(this.element);

    this.$characterSize = this.$measureSizes() || {width: 0, height: 0};
    this.$pollSizeChanges();
};

(function() {

    oop.implement(this, EventEmitter);

    this.EOF_CHAR = "\xB6"; //"&para;";
    this.EOL_CHAR = "\xAC"; //"&not;";
    this.TAB_CHAR = "\u2192"; //"&rarr;";
    this.SPACE_CHAR = "\xB7"; //"&middot;";
    this.$padding = 0;

    this.setPadding = function(padding) {
        this.$padding = padding;
        this.element.style.padding = "0 " + padding + "px";
    };

    this.getLineHeight = function() {
        return this.$characterSize.height || 1;
    };

    this.getCharacterWidth = function() {
        return this.$characterSize.width || 1;
    };

    this.checkForSizeChanges = function() {
        var size = this.$measureSizes();
        if (size && (this.$characterSize.width !== size.width || this.$characterSize.height !== size.height)) {
            this.$characterSize = size;
            this._emit("changeCharacterSize", {data: size});
        }
    };

    this.$pollSizeChanges = function() {
        var self = this;
        this.$pollSizeChangesTimer = setInterval(function() {
            self.checkForSizeChanges();
        }, 500);
    };

    this.$fontStyles = {
        fontFamily : 1,
        fontSize : 1,
        fontWeight : 1,
        fontStyle : 1,
        lineHeight : 1
    };

    this.$measureSizes = useragent.isIE || useragent.isOldGecko ? function() {
        var n = 1000;
        if (!this.$measureNode) {
            var measureNode = this.$measureNode = dom.createElement("div");
            var style = measureNode.style;

            style.width = style.height = "auto";
            style.left = style.top = (-n * 40)  + "px";

            style.visibility = "hidden";
            style.position = "fixed";
            style.overflow = "visible";
            style.whiteSpace = "nowrap";

            // in FF 3.6 monospace fonts can have a fixed sub pixel width.
            // that's why we have to measure many characters
            // Note: characterWidth can be a float!
            measureNode.innerHTML = lang.stringRepeat("Xy", n);

            if (this.element.ownerDocument.body) {
                this.element.ownerDocument.body.appendChild(measureNode);
            } else {
                var container = this.element.parentNode;
                while (!dom.hasCssClass(container, "ace_editor"))
                    container = container.parentNode;
                container.appendChild(measureNode);
            }
        }
        
        // Size and width can be null if the editor is not visible or
        // detached from the document
        if (!this.element.offsetWidth)
            return null;

        var style = this.$measureNode.style;
        var computedStyle = dom.computedStyle(this.element);
        for (var prop in this.$fontStyles)
            style[prop] = computedStyle[prop];

        var size = {
            height: this.$measureNode.offsetHeight,
            width: this.$measureNode.offsetWidth / (n * 2)
        };

        // Size and width can be null if the editor is not visible or
        // detached from the document
        if (size.width == 0 || size.height == 0)
            return null;

        return size;
    } 
    : function() {
        if (!this.$measureNode) {
            var measureNode = this.$measureNode = dom.createElement("div");
            var style = measureNode.style;

            style.width = style.height = "auto";
            style.left = style.top = -100 + "px";

            style.visibility = "hidden";
            style.position = "fixed";
            style.overflow = "visible";
            style.whiteSpace = "nowrap";

            measureNode.innerHTML = "X";

            var container = this.element.parentNode;
            while (container && !dom.hasCssClass(container, "ace_editor"))
                container = container.parentNode;

            if (!container)
                return this.$measureNode = null;

            container.appendChild(measureNode);
        }
        
        var rect = this.$measureNode.getBoundingClientRect();

        var size = {
            height: rect.height,
            width: rect.width
        };

        // Size and width can be null if the editor is not visible or
        // detached from the document
        if (size.width == 0 || size.height == 0)
            return null;

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

    this.$tabStrings = [];
    this.$computeTabString = function() {
        var tabSize = this.session.getTabSize();
        var tabStr = this.$tabStrings = [0];
        for (var i = 1; i < tabSize + 1; i++) {
            if (this.showInvisibles) {
                tabStr.push("<span class='ace_invisible'>"
                    + this.TAB_CHAR
                    + new Array(i).join("&#160;")
                    + "</span>");
            } else {
                tabStr.push(new Array(i+1).join("&#160;"));
            }
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
        var lineElementsIdx = 0;

        for (var row = config.firstRow; row < first; row++) {
            var foldLine = this.session.getFoldLine(row);
            if (foldLine) {
                if (foldLine.containsRow(first)) {
                    first = foldLine.start.row;
                    break;
                } else {
                    row = foldLine.end.row;
                }
            }
            lineElementsIdx ++;
        }

        for (var i=first; i<=last; i++) {
            var lineElement = lineElements[lineElementsIdx++];
            if (!lineElement)
                continue;

            var html = [];
            var tokens = this.session.getTokens(i, i);
            this.$renderLine(html, i, tokens[0].tokens, !this.$useLineGroups());
            lineElement = dom.setInnerHtml(lineElement, html.join(""));

            i = this.session.getRowFoldEnd(i);
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
            for (var row=this.session.getFoldedRowCount(oldConfig.firstRow, config.firstRow - 1); row>0; row--)
                el.removeChild(el.firstChild);

        if (oldConfig.lastRow > config.lastRow)
            for (var row=this.session.getFoldedRowCount(config.lastRow + 1, oldConfig.lastRow); row>0; row--)
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
        var fragment = this.element.ownerDocument.createDocumentFragment();
        var row = firstRow;
        var foldLine = this.session.getNextFoldLine(row);
        var foldStart = foldLine ? foldLine.start.row : Infinity;

        while (true) {
            if (row > foldStart) {
                row = foldLine.end.row+1;
                foldLine = this.session.getNextFoldLine(row, foldLine);
                foldStart = foldLine ? foldLine.start.row : Infinity;
            }
            if (row > lastRow)
                break;

            var container = dom.createElement("div");

            var html = [];
            // Get the tokens per line as there might be some lines in between
            // beeing folded.
            // OPTIMIZE: If there is a long block of unfolded lines, just make
            // this call once for that big block of unfolded lines.
            var tokens = this.session.getTokens(row, row);
            if (tokens.length == 1)
                this.$renderLine(html, row, tokens[0].tokens, false);

            // don't use setInnerHtml since we are working with an empty DIV
            container.innerHTML = html.join("");
            if (this.$useLineGroups()) {
                container.className = 'ace_line_group';
                fragment.appendChild(container);
            } else {
                var lines = container.childNodes
                while(lines.length)
                    fragment.appendChild(lines[0]);
            }

            row++;
        }
        return fragment;
    };

    this.update = function(config) {
        this.$computeTabString();
        this.config = config;

        var html = [];
        var firstRow = config.firstRow, lastRow = config.lastRow;

        var row = firstRow;
        var foldLine = this.session.getNextFoldLine(row);
        var foldStart = foldLine ? foldLine.start.row : Infinity;

        while (true) {
            if (row > foldStart) {
                row = foldLine.end.row+1;
                foldLine = this.session.getNextFoldLine(row, foldLine);
                foldStart = foldLine ? foldLine.start.row :Infinity;
            }
            if (row > lastRow)
                break;

            if (this.$useLineGroups())
                html.push("<div class='ace_line_group'>")

            // Get the tokens per line as there might be some lines in between
            // beeing folded.
            // OPTIMIZE: If there is a long block of unfolded lines, just make
            // this call once for that big block of unfolded lines.
            var tokens = this.session.getTokens(row, row);
            if (tokens.length == 1)
                this.$renderLine(html, row, tokens[0].tokens, false);

            if (this.$useLineGroups())
                html.push("</div>"); // end the line group

            row++;
        }
        this.element = dom.setInnerHtml(this.element, html.join(""));
    };

    this.$textToken = {
        "text": true,
        "rparen": true,
        "lparen": true
    };

    this.$renderToken = function(stringBuilder, screenColumn, token, value) {        
        var self = this;
        var replaceReg = /\t|&|<|( +)|([\u0000-\u0019\u00a0\u2000-\u200b\u2028\u2029\u3000])|[\u1100-\u115F\u11A3-\u11A7\u11FA-\u11FF\u2329-\u232A\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3000-\u303E\u3041-\u3096\u3099-\u30FF\u3105-\u312D\u3131-\u318E\u3190-\u31BA\u31C0-\u31E3\u31F0-\u321E\u3220-\u3247\u3250-\u32FE\u3300-\u4DBF\u4E00-\uA48C\uA490-\uA4C6\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFAFF\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFF01-\uFF60\uFFE0-\uFFE6]/g;
        var replaceFunc = function(c, a, b, tabIdx, idx4) {
            if (a) {
                return new Array(c.length+1).join("&#160;");
            } else if (c == "&") {
                return "&#38;";
            } else if (c == "<") {
                return "&#60;";
            } else if (c == "\t") {
                var tabSize = self.session.getScreenTabSize(screenColumn + tabIdx);
                screenColumn += tabSize - 1;
                return self.$tabStrings[tabSize];
            } else if (c == "\u3000") {
                // U+3000 is both invisible AND full-width, so must be handled uniquely
                var classToUse = self.showInvisibles ? "ace_cjk ace_invisible" : "ace_cjk";
                var space = self.showInvisibles ? self.SPACE_CHAR : "";
                screenColumn += 1;
                return "<span class='" + classToUse + "' style='width:" +
                    (self.config.characterWidth * 2) +
                    "px'>" + space + "</span>";
            } else if (b) {
                return "<span class='ace_invisible ace_invalid'>" + self.SPACE_CHAR + "</span>";
            } else {
                screenColumn += 1;
                return "<span class='ace_cjk' style='width:" +
                    (self.config.characterWidth * 2) +
                    "px'>" + c + "</span>";
            }
        };

        var output = value.replace(replaceReg, replaceFunc);

        if (!this.$textToken[token.type]) {
            var classes = "ace_" + token.type.replace(/\./g, " ace_");
            var style = "";
            if (token.type == "fold")
                style = " style='width:" + (token.value.length * this.config.characterWidth) + "px;' ";
            stringBuilder.push("<span class='", classes, "'", style, ">", output, "</span>");
        }
        else {
            stringBuilder.push(output);
        }
        return screenColumn + value.length;
    };

    this.$renderLineCore = function(stringBuilder, lastRow, tokens, splits, onlyContents) {
        var chars = 0;
        var split = 0;
        var splitChars;
        var screenColumn = 0;
        var self = this;

        if (!splits || splits.length == 0)
            splitChars = Number.MAX_VALUE;
        else
            splitChars = splits[0];

        if (!onlyContents) {
            stringBuilder.push("<div class='ace_line' style='height:",
                this.config.lineHeight, "px",
                "'>"
            );
        }
        
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            var value = token.value;

            if (chars + value.length < splitChars) {
                screenColumn = self.$renderToken(
                    stringBuilder, screenColumn, token, value
                );
                chars += value.length;
            }
            else {
                while (chars + value.length >= splitChars) {
                    screenColumn = self.$renderToken(
                        stringBuilder, screenColumn, 
                        token, value.substring(0, splitChars - chars)
                    );
                    value = value.substring(splitChars - chars);
                    chars = splitChars;
                    
                    if (!onlyContents) {
                        stringBuilder.push("</div>",
                            "<div class='ace_line' style='height:",
                            this.config.lineHeight, "px",
                            "'>"
                        );
                    }

                    split ++;
                    screenColumn = 0;
                    splitChars = splits[split] || Number.MAX_VALUE;
                }
                if (value.length != 0) {
                    chars += value.length;
                    screenColumn = self.$renderToken(
                        stringBuilder, screenColumn, token, value
                    );
                }
            }
        }

        if (this.showInvisibles) {
            if (lastRow !== this.session.getLength() - 1)
                stringBuilder.push("<span class='ace_invisible'>" + this.EOL_CHAR + "</span>");
            else
                stringBuilder.push("<span class='ace_invisible'>" + this.EOF_CHAR + "</span>");
        }
        if (!onlyContents)
            stringBuilder.push("</div>");
    };

    this.$renderLine = function(stringBuilder, row, tokens, onlyContents) {
        // Check if the line to render is folded or not. If not, things are
        // simple, otherwise, we need to fake some things...
        if (!this.session.isRowFolded(row)) {
            var splits = this.session.getRowSplitData(row);
            this.$renderLineCore(stringBuilder, row, tokens, splits, onlyContents);
        } else {
            this.$renderFoldLine(stringBuilder, row, tokens, onlyContents);
        }
    };

    this.$renderFoldLine = function(stringBuilder, row, tokens, onlyContents) {
        var session = this.session,
            foldLine = session.getFoldLine(row),
            renderTokens = [];

        function addTokens(tokens, from, to) {
            var idx = 0, col = 0;
            while ((col + tokens[idx].value.length) < from) {
                col += tokens[idx].value.length;
                idx++;

                if (idx == tokens.length) {
                    return;
                }
            }
            if (col != from) {
                var value = tokens[idx].value.substring(from - col);
                // Check if the token value is longer then the from...to spacing.
                if (value.length > (to - from)) {
                    value = value.substring(0, to - from);
                }

                renderTokens.push({
                    type: tokens[idx].type,
                    value: value
                });

                col = from + value.length;
                idx += 1;
            }

            while (col < to) {
                var value = tokens[idx].value;
                if (value.length + col > to) {
                    value = value.substring(0, to - col);
                }
                renderTokens.push({
                    type: tokens[idx].type,
                    value: value
                });
                col += value.length;
                idx += 1;
            }
        }

        foldLine.walk(function(placeholder, row, column, lastColumn, isNewRow) {
            if (placeholder) {
               renderTokens.push({
                    type: "fold",
                    value: placeholder
                });
            } else {
                if (isNewRow) {
                   tokens = this.session.getTokens(row, row)[0].tokens;
                }
                if (tokens.length != 0) {
                    addTokens(tokens, lastColumn, column);
                }
            }
        }.bind(this), foldLine.end.row, this.session.getLine(foldLine.end.row).length);

        // TODO: Build a fake splits array!
        var splits = this.session.$useWrapMode?this.session.$wrapData[row]:null;
        this.$renderLineCore(stringBuilder, row, renderTokens, splits, onlyContents);
    };
    
    this.$useLineGroups = function() {
        // For the updateLines function to work correctly, it's important that the
        // child nodes of this.element correspond on a 1-to-1 basis to rows in the 
        // document (as distinct from lines on the screen). For sessions that are
        // wrapped, this means we need to add a layer to the node hierarchy (tagged
        // with the class name ace_line_group).
        return this.session.getUseWrapMode();
    };

    this.destroy = function() {
        clearInterval(this.$pollSizeChangesTimer);
        if (this.$measureNode)
            this.$measureNode.parentNode.removeChild(this.$measureNode);
        delete this.$measureNode;
    };

}).call(Text.prototype);

exports.Text = Text;

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

ace.define('ace/layer/cursor', ['require', 'exports', 'module' , 'ace/lib/dom'], function(require, exports, module) {
"use strict";

var dom = require("../lib/dom");

var Cursor = function(parentEl) {
    this.element = dom.createElement("div");
    this.element.className = "ace_layer ace_cursor-layer";
    parentEl.appendChild(this.element);

    this.isVisible = false;

    this.cursors = [];
    this.cursor = this.addCursor();
};

(function() {

    this.$padding = 0;
    this.setPadding = function(padding) {
        this.$padding = padding;
    };

    this.setSession = function(session) {
        this.session = session;
    };

    this.addCursor = function() {
        var el = dom.createElement("div");
        var className = "ace_cursor";
        if (!this.isVisible)
            className += " ace_hidden";
        if (this.overwrite)
            className += " ace_overwrite";

        el.className = className;
        this.element.appendChild(el);
        this.cursors.push(el);
        return el;
    };

    this.removeCursor = function() {
        if (this.cursors.length > 1) {
            var el = this.cursors.pop();
            el.parentNode.removeChild(el);
            return el;
        }
    };

    this.hideCursor = function() {
        this.isVisible = false;
        for (var i = this.cursors.length; i--; )
            dom.addCssClass(this.cursors[i], "ace_hidden");
        clearInterval(this.blinkId);
    };

    this.showCursor = function() {
        this.isVisible = true;
        for (var i = this.cursors.length; i--; )
            dom.removeCssClass(this.cursors[i], "ace_hidden");

        this.element.style.visibility = "";
        this.restartTimer();
    };

    this.restartTimer = function() {
        clearInterval(this.blinkId);
        if (!this.isVisible)
            return;

        var element = this.cursors.length == 1 ? this.cursor : this.element;
        this.blinkId = setInterval(function() {
            element.style.visibility = "hidden";
            setTimeout(function() {
                element.style.visibility = "";
            }, 400);
        }, 1000);
    };

    this.getPixelPosition = function(position, onScreen) {
        if (!this.config || !this.session) {
            return {
                left : 0,
                top : 0
            };
        }

        if (!position)
            position = this.session.selection.getCursor();
        var pos = this.session.documentToScreenPosition(position);
        var cursorLeft = Math.round(this.$padding +
                                    pos.column * this.config.characterWidth);
        var cursorTop = (pos.row - (onScreen ? this.config.firstRowScreen : 0)) *
            this.config.lineHeight;

        return {
            left : cursorLeft,
            top : cursorTop
        };
    };

    this.update = function(config) {
        this.config = config;

        if (this.session.selectionMarkerCount > 0) {
            var selections = this.session.$selectionMarkers;
            var i = 0, sel, cursorIndex = 0;

            for (var i = selections.length; i--; ) {
                sel = selections[i];
                var pixelPos = this.getPixelPosition(sel.cursor, true);

                var style = (this.cursors[cursorIndex++] || this.addCursor()).style;

                style.left = pixelPos.left + "px";
                style.top = pixelPos.top + "px";
                style.width = config.characterWidth + "px";
                style.height = config.lineHeight + "px";
            }
            if (cursorIndex > 1)
                while (this.cursors.length > cursorIndex)
                    this.removeCursor();
        } else {
            var pixelPos = this.getPixelPosition(null, true);
            var style = this.cursor.style;
            style.left = pixelPos.left + "px";
            style.top = pixelPos.top + "px";
            style.width = config.characterWidth + "px";
            style.height = config.lineHeight + "px";

            while (this.cursors.length > 1)
                this.removeCursor();
        }

        var overwrite = this.session.getOverwrite();
        if (overwrite != this.overwrite)
            this.$setOverite(overwrite);

        // cache for textarea and gutter highlight
        this.$pixelPos = pixelPos;

        this.restartTimer();
    };

    this.$setOverite = function(overwrite) {
        this.overwrite = overwrite;
        for (var i = this.cursors.length; i--; ) {
            if (overwrite)
                dom.addCssClass(this.cursors[i], "ace_overwrite");
            else
                dom.removeCssClass(this.cursors[i], "ace_overwrite");
        }
    };

    this.destroy = function() {
        clearInterval(this.blinkId);
    }

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

ace.define('ace/scrollbar', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/lib/dom', 'ace/lib/event', 'ace/lib/event_emitter'], function(require, exports, module) {
"use strict";

var oop = require("./lib/oop");
var dom = require("./lib/dom");
var event = require("./lib/event");
var EventEmitter = require("./lib/event_emitter").EventEmitter;

/**
 * class ScrollBar
 *
 * A set of methods for setting and retrieving the editor's scrollbar. 
 *
 **/

/**
 * new ScrollBar(parent)
 * - parent (DOMElement): A DOM element 
 *
 * Creates a new `ScrollBar`. `parent` is the owner of the scroll bar.
 *
 **/
var ScrollBar = function(parent) {
    this.element = dom.createElement("div");
    this.element.className = "ace_sb";

    this.inner = dom.createElement("div");
    this.element.appendChild(this.inner);

    parent.appendChild(this.element);

    // in OSX lion the scrollbars appear to have no width. In this case resize
    // the to show the scrollbar but still pretend that the scrollbar has a width
    // of 0px
    // in Firefox 6+ scrollbar is hidden if element has the same width as scrollbar
    // make element a little bit wider to retain scrollbar when page is zoomed 
    this.width = dom.scrollbarWidth(parent.ownerDocument);
    this.element.style.width = (this.width || 15) + 5 + "px";

    event.addListener(this.element, "scroll", this.onScroll.bind(this));
};

(function() {
    oop.implement(this, EventEmitter);

    /**
     * ScrollBar@onScroll
     *
     * Emitted when the scroll bar, well, scrolls.
     *
     **/
    this.onScroll = function() {
        this._emit("scroll", {data: this.element.scrollTop});
    };

    /**
     * ScrollBar.getWidth() -> Number
     *
     * Returns the width of the scroll bar.
     *
     **/
    this.getWidth = function() {
        return this.width;
    };

    /**
     * ScrollBar.setHeight(height)
     * - height (Number): The new height
     *
     * Sets the height of the scroll bar, in pixels.
     *
     **/
    this.setHeight = function(height) {
        this.element.style.height = height + "px";
    };

    /**
     * ScrollBar.setInnerHeight(height)
     * - height (Number): The new inner height
     *
     * Sets the inner height of the scroll bar, in pixels.
     *
     **/
    this.setInnerHeight = function(height) {
        this.inner.style.height = height + "px";
    };

    /**
     * ScrollBar.setScrollTop(scrollTop)
     * - scrollTop (Number): The new scroll top
     *
     * Sets the scroll top of the scroll bar.
     *
     **/
    // TODO: on chrome 17+ after for small zoom levels after this function
    // this.element.scrollTop != scrollTop which makes page to scroll up.
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

ace.define('ace/renderloop', ['require', 'exports', 'module' , 'ace/lib/event'], function(require, exports, module) {
"use strict";

var event = require("./lib/event");

/** internal, hide
 * class RenderLoop
 *
 * Batches changes (that force something to be redrawn) in the background.
 *
 **/

/** internal, hide
 * new RenderLoop(onRender, win)
 *
 * 
 *
**/
var RenderLoop = function(onRender, win) {
    this.onRender = onRender;
    this.pending = false;
    this.changes = 0;
    this.window = win || window;
};

(function() {

    /** internal, hide
     * RenderLoop.schedule(change)
     * - change (Array):
     * 
     * 
     **/
    this.schedule = function(change) {
        //this.onRender(change);
        //return;
        this.changes = this.changes | change;
        if (!this.pending) {
            this.pending = true;
            var _self = this;
            event.nextTick(function() {
                _self.pending = false;
                var changes;
                while (changes = _self.changes) {
                    _self.changes = 0;
                    _self.onRender(changes);
                }
            }, this.window);
        }
    };

}).call(RenderLoop.prototype);

exports.RenderLoop = RenderLoop;
});
ace.define("text!ace/css/editor.css", [], "\n" +
  ".ace_editor {\n" +
  "    position: absolute;\n" +
  "    overflow: hidden;\n" +
  "    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Droid Sans Mono', 'Consolas', monospace;\n" +
  "    font-size: 12px;\n" +
  "}\n" +
  "\n" +
  ".ace_scroller {\n" +
  "    position: absolute;\n" +
  "    overflow-x: scroll;\n" +
  "    overflow-y: hidden;\n" +
  "}\n" +
  "\n" +
  ".ace_content {\n" +
  "    position: absolute;\n" +
  "    box-sizing: border-box;\n" +
  "    -moz-box-sizing: border-box;\n" +
  "    -webkit-box-sizing: border-box;\n" +
  "    cursor: text;\n" +
  "}\n" +
  "\n" +
  ".ace_composition {\n" +
  "    position: absolute;\n" +
  "    background: #555;\n" +
  "    color: #DDD;\n" +
  "    z-index: 4;\n" +
  "}\n" +
  "\n" +
  ".ace_gutter {\n" +
  "    position: absolute;\n" +
  "    overflow : hidden;\n" +
  "    height: 100%;\n" +
  "    width: auto;\n" +
  "    cursor: default;\n" +
  "    z-index: 1000;\n" +
  "}\n" +
  "\n" +
  ".ace_gutter_active_line {\n" +
  "    position: absolute;\n" +
  "    right: 0;\n" +
  "    width: 100%;\n" +
  "}\n" +
  "\n" +
  ".ace_gutter.horscroll {\n" +
  "    box-shadow: 0px 0px 20px rgba(0,0,0,0.4);\n" +
  "}\n" +
  "\n" +
  ".ace_gutter-cell {\n" +
  "    padding-left: 19px;\n" +
  "    padding-right: 6px;\n" +
  "}\n" +
  "\n" +
  ".ace_gutter-cell.ace_error {\n" +
  "    background-image: url(\"data:image/gif,GIF89a%10%00%10%00%D5%00%00%F5or%F5%87%88%F5nr%F4ns%EBmq%F5z%7F%DDJT%DEKS%DFOW%F1Yc%F2ah%CE(7%CE)8%D18E%DD%40M%F2KZ%EBU%60%F4%60m%DCir%C8%16(%C8%19*%CE%255%F1%3FR%F1%3FS%E6%AB%B5%CA%5DI%CEn%5E%F7%A2%9A%C9G%3E%E0a%5B%F7%89%85%F5yy%F6%82%80%ED%82%80%FF%BF%BF%E3%C4%C4%FF%FF%FF%FF%FF%FF%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00!%F9%04%01%00%00%25%00%2C%00%00%00%00%10%00%10%00%00%06p%C0%92pH%2C%1A%8F%C8%D2H%93%E1d4%23%E4%88%D3%09mB%1DN%B48%F5%90%40%60%92G%5B%94%20%3E%22%D2%87%24%FA%20%24%C5%06A%00%20%B1%07%02B%A38%89X.v%17%82%11%13q%10%0Fi%24%0F%8B%10%7BD%12%0Ei%09%92%09%0EpD%18%15%24%0A%9Ci%05%0C%18F%18%0B%07%04%01%04%06%A0H%18%12%0D%14%0D%12%A1I%B3%B4%B5IA%00%3B\");\n" +
  "    background-repeat: no-repeat;\n" +
  "    background-position: 2px center;\n" +
  "}\n" +
  "\n" +
  ".ace_gutter-cell.ace_warning {\n" +
  "    background-image: url(\"data:image/gif,GIF89a%10%00%10%00%D5%00%00%FF%DBr%FF%DE%81%FF%E2%8D%FF%E2%8F%FF%E4%96%FF%E3%97%FF%E5%9D%FF%E6%9E%FF%EE%C1%FF%C8Z%FF%CDk%FF%D0s%FF%D4%81%FF%D5%82%FF%D5%83%FF%DC%97%FF%DE%9D%FF%E7%B8%FF%CCl%7BQ%13%80U%15%82W%16%81U%16%89%5B%18%87%5B%18%8C%5E%1A%94d%1D%C5%83-%C9%87%2F%C6%84.%C6%85.%CD%8B2%C9%871%CB%8A3%CD%8B5%DC%98%3F%DF%9BB%E0%9CC%E1%A5U%CB%871%CF%8B5%D1%8D6%DB%97%40%DF%9AB%DD%99B%E3%B0p%E7%CC%AE%FF%FF%FF%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00!%F9%04%01%00%00%2F%00%2C%00%00%00%00%10%00%10%00%00%06a%C0%97pH%2C%1A%8FH%A1%ABTr%25%87%2B%04%82%F4%7C%B9X%91%08%CB%99%1C!%26%13%84*iJ9(%15G%CA%84%14%01%1A%97%0C%03%80%3A%9A%3E%81%84%3E%11%08%B1%8B%20%02%12%0F%18%1A%0F%0A%03'F%1C%04%0B%10%16%18%10%0B%05%1CF%1D-%06%07%9A%9A-%1EG%1B%A0%A1%A0U%A4%A5%A6BA%00%3B\");\n" +
  "    background-repeat: no-repeat;\n" +
  "    background-position: 2px center;\n" +
  "}\n" +
  "\n" +
  ".ace_gutter-cell.ace_info {\n" +
  "    background-image: url(\"data:image/gif;base64,R0lGODlhEAAQAMQAAAAAAEFBQVJSUl5eXmRkZGtra39/f4WFhYmJiZGRkaampry8vMPDw8zMzNXV1dzc3OTk5Orq6vDw8P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABQALAAAAAAQABAAAAUuICWOZGmeaBml5XGwFCQSBGyXRSAwtqQIiRuiwIM5BoYVbEFIyGCQoeJGrVptIQA7\");\n" +
  "    background-repeat: no-repeat;\n" +
  "    background-position: 2px center;\n" +
  "}\n" +
  "\n" +
  ".ace_editor .ace_sb {\n" +
  "    position: absolute;\n" +
  "    overflow-x: hidden;\n" +
  "    overflow-y: scroll;\n" +
  "    right: 0;\n" +
  "}\n" +
  "\n" +
  ".ace_editor .ace_sb div {\n" +
  "    position: absolute;\n" +
  "    width: 1px;\n" +
  "    left: 0;\n" +
  "}\n" +
  "\n" +
  ".ace_editor .ace_print_margin_layer {\n" +
  "    z-index: 0;\n" +
  "    position: absolute;\n" +
  "    overflow: hidden;\n" +
  "    margin: 0;\n" +
  "    left: 0;\n" +
  "    height: 100%;\n" +
  "    width: 100%;\n" +
  "}\n" +
  "\n" +
  ".ace_editor .ace_print_margin {\n" +
  "    position: absolute;\n" +
  "    height: 100%;\n" +
  "}\n" +
  "\n" +
  ".ace_editor textarea {\n" +
  "    position: fixed;\n" +
  "    z-index: 0;\n" +
  "    width: 0.5em;\n" +
  "    height: 1em;\n" +
  "    opacity: 0;\n" +
  "    background: transparent;\n" +
  "    appearance: none;\n" +
  "    -moz-appearance: none;\n" +
  "    border: none;\n" +
  "    resize: none;\n" +
  "    outline: none;\n" +
  "    overflow: hidden;\n" +
  "}\n" +
  "\n" +
  ".ace_layer {\n" +
  "    z-index: 1;\n" +
  "    position: absolute;\n" +
  "    overflow: hidden;\n" +
  "    white-space: nowrap;\n" +
  "    height: 100%;\n" +
  "    width: 100%;\n" +
  "    box-sizing: border-box;\n" +
  "    -moz-box-sizing: border-box;\n" +
  "    -webkit-box-sizing: border-box;\n" +
  "    /* setting pointer-events: auto; on node under the mouse, which changes\n" +
  "        during scroll, will break mouse wheel scrolling in Safari */\n" +
  "    pointer-events: none;\n" +
  "}\n" +
  "\n" +
  ".ace_gutter .ace_layer {\n" +
  "    position: relative;\n" +
  "    min-width: 40px;\n" +
  "    text-align: right;\n" +
  "    pointer-events: auto;\n" +
  "}\n" +
  "\n" +
  ".ace_text-layer {\n" +
  "    color: black;\n" +
  "    font: inherit !important;\n" +
  "}\n" +
  "\n" +
  ".ace_cjk {\n" +
  "    display: inline-block;\n" +
  "    text-align: center;\n" +
  "}\n" +
  "\n" +
  ".ace_cursor-layer {\n" +
  "    z-index: 4;\n" +
  "}\n" +
  "\n" +
  ".ace_cursor {\n" +
  "    z-index: 4;\n" +
  "    position: absolute;\n" +
  "}\n" +
  "\n" +
  ".ace_cursor.ace_hidden {\n" +
  "    opacity: 0.2;\n" +
  "}\n" +
  "\n" +
  ".ace_editor.multiselect .ace_cursor {\n" +
  "    border-left-width: 1px;\n" +
  "}\n" +
  "\n" +
  ".ace_line {\n" +
  "    white-space: nowrap;\n" +
  "}\n" +
  "\n" +
  ".ace_marker-layer .ace_step {\n" +
  "    position: absolute;\n" +
  "    z-index: 3;\n" +
  "}\n" +
  "\n" +
  ".ace_marker-layer .ace_selection {\n" +
  "    position: absolute;\n" +
  "    z-index: 5;\n" +
  "}\n" +
  "\n" +
  ".ace_marker-layer .ace_bracket {\n" +
  "    position: absolute;\n" +
  "    z-index: 6;\n" +
  "}\n" +
  "\n" +
  ".ace_marker-layer .ace_active_line {\n" +
  "    position: absolute;\n" +
  "    z-index: 2;\n" +
  "}\n" +
  "\n" +
  ".ace_marker-layer .ace_selected_word {\n" +
  "    position: absolute;\n" +
  "    z-index: 4;\n" +
  "    box-sizing: border-box;\n" +
  "    -moz-box-sizing: border-box;\n" +
  "    -webkit-box-sizing: border-box;\n" +
  "}\n" +
  "\n" +
  ".ace_line .ace_fold {\n" +
  "    box-sizing: border-box;\n" +
  "    -moz-box-sizing: border-box;\n" +
  "    -webkit-box-sizing: border-box;\n" +
  "    \n" +
  "    display: inline-block;\n" +
  "    height: 11px;\n" +
  "    margin-top: -2px;\n" +
  "    vertical-align: middle;\n" +
  "\n" +
  "    background-image: \n" +
  "        url(\"data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%11%00%00%00%09%08%06%00%00%00%D4%E8%C7%0C%00%00%03%1EiCCPICC%20Profile%00%00x%01%85T%DFk%D3P%14%FE%DAe%9D%B0%E1%8B%3Ag%11%09%3Eh%91ndStC%9C%B6kW%BA%CDZ%EA6%B7!H%9B%A6m%5C%9A%C6%24%ED~%B0%07%D9%8Bo%3A%C5w%F1%07%3E%F9%07%0C%D9%83o%7B%92%0D%C6%14a%F8%AC%88%22L%F6%22%B3%9E%9B4M'S%03%B9%F7%BB%DF%F9%EE9'%E7%E4%5E%A0%F9qZ%D3%14%2F%0F%14USO%C5%C2%FC%C4%E4%14%DF%F2%01%5E%1CC%2B%FChM%8B%86%16J%26G%40%0F%D3%B2y%EF%B3%F3%0E%1E%C6lt%EEo%DF%AB%FEc%D5%9A%95%0C%11%F0%1C%20%BE%945%C4%22%E1Y%A0i%5C%D4t%13%E0%D6%89%EF%9D15%C2%CDLsX%A7%04%09%1Fg8oc%81%E1%8C%8D%23%96f45%40%9A%09%C2%07%C5B%3AK%B8%408%98i%E0%F3%0D%D8%CE%81%14%E4'%26%A9%92.%8B%3C%ABER%2F%E5dE%B2%0C%F6%F0%1Fs%83%F2_%B0%A8%94%E9%9B%AD%E7%10%8Dm%9A%19N%D1%7C%8A%DE%1F9%7Dp%8C%E6%00%D5%C1%3F_%18%BDA%B8%9DpX6%E3%A35~B%CD%24%AE%11%26%BD%E7%EEti%98%EDe%9A%97Y)%12%25%1C%24%BCbT%AE3li%E6%0B%03%89%9A%E6%D3%ED%F4P%92%B0%9F4%BF43Y%F3%E3%EDP%95%04%EB1%C5%F5%F6KF%F4%BA%BD%D7%DB%91%93%07%E35%3E%A7)%D6%7F%40%FE%BD%F7%F5r%8A%E5y%92%F0%EB%B4%1E%8D%D5%F4%5B%92%3AV%DB%DB%E4%CD%A6%23%C3%C4wQ%3F%03HB%82%8E%1Cd(%E0%91B%0Ca%9Ac%C4%AA%F8L%16%19%22J%A4%D2itTy%B28%D6%3B(%93%96%ED%1CGx%C9_%0E%B8%5E%16%F5%5B%B2%B8%F6%E0%FB%9E%DD%25%D7%8E%BC%15%85%C5%B7%A3%D8Q%ED%B5%81%E9%BA%B2%13%9A%1B%7Fua%A5%A3n%E17%B9%E5%9B%1Bm%AB%0B%08Q%FE%8A%E5%B1H%5Ee%CAO%82Q%D7u6%E6%90S%97%FCu%0B%CF2%94%EE%25v%12X%0C%BA%AC%F0%5E%F8*l%0AO%85%17%C2%97%BF%D4%C8%CE%DE%AD%11%CB%80q%2C%3E%AB%9ES%CD%C6%EC%25%D2L%D2%EBd%B8%BF%8A%F5B%C6%18%F9%901CZ%9D%BE%24M%9C%8A9%F2%DAP%0B'%06w%82%EB%E6%E2%5C%2F%D7%07%9E%BB%CC%5D%E1%FA%B9%08%AD.r%23%8E%C2%17%F5E%7C!%F0%BE3%BE%3E_%B7o%88a%A7%DB%BE%D3d%EB%A31Z%EB%BB%D3%91%BA%A2%B1z%94%8F%DB'%F6%3D%8E%AA%13%19%B2%B1%BE%B1~V%08%2B%B4%A2cjJ%B3tO%00%03%25mN%97%F3%05%93%EF%11%84%0B%7C%88%AE-%89%8F%ABbW%90O%2B%0Ao%99%0C%5E%97%0CI%AFH%D9.%B0%3B%8F%ED%03%B6S%D6%5D%E6i_s9%F3*p%E9%1B%FD%C3%EB.7U%06%5E%19%C0%D1s.%17%A03u%E4%09%B0%7C%5E%2C%EB%15%DB%1F%3C%9E%B7%80%91%3B%DBc%AD%3Dma%BA%8B%3EV%AB%DBt.%5B%1E%01%BB%0F%AB%D5%9F%CF%AA%D5%DD%E7%E4%7F%0Bx%A3%FC%06%A9%23%0A%D6%C2%A1_2%00%00%00%09pHYs%00%00%0B%13%00%00%0B%13%01%00%9A%9C%18%00%00%00%B5IDAT(%15%A5%91%3D%0E%02!%10%85ac%E1%05%D6%CE%D6%C6%CE%D2%E8%ED%CD%DE%C0%C6%D6N.%E0V%F8%3D%9Ca%891XH%C2%BE%D9y%3F%90!%E6%9C%C3%BFk%E5%011%C6-%F5%C8N%04%DF%BD%FF%89%DFt%83DN%60%3E%F3%AB%A0%DE%1A%5Dg%BE%10Q%97%1B%40%9C%A8o%10%8F%5E%828%B4%1B%60%87%F6%02%26%85%1Ch%1E%C1%2B%5Bk%FF%86%EE%B7j%09%9A%DA%9B%ACe%A3%F9%EC%DA!9%B4%D5%A6%81%86%86%98%CC%3C%5B%40%FA%81%B3%E9%CB%23%94%C16Azo%05%D4%E1%C1%95a%3B%8A'%A0%E8%CC%17%22%85%1D%BA%00%A2%FA%DC%0A%94%D1%D1%8D%8B%3A%84%17B%C7%60%1A%25Z%FC%8D%00%00%00%00IEND%AEB%60%82\"),\n" +
  "        url(\"data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%05%00%00%007%08%06%00%00%00%C4%DD%80C%00%00%03%1EiCCPICC%20Profile%00%00x%01%85T%DFk%D3P%14%FE%DAe%9D%B0%E1%8B%3Ag%11%09%3Eh%91ndStC%9C%B6kW%BA%CDZ%EA6%B7!H%9B%A6m%5C%9A%C6%24%ED~%B0%07%D9%8Bo%3A%C5w%F1%07%3E%F9%07%0C%D9%83o%7B%92%0D%C6%14a%F8%AC%88%22L%F6%22%B3%9E%9B4M'S%03%B9%F7%BB%DF%F9%EE9'%E7%E4%5E%A0%F9qZ%D3%14%2F%0F%14USO%C5%C2%FC%C4%E4%14%DF%F2%01%5E%1CC%2B%FChM%8B%86%16J%26G%40%0F%D3%B2y%EF%B3%F3%0E%1E%C6lt%EEo%DF%AB%FEc%D5%9A%95%0C%11%F0%1C%20%BE%945%C4%22%E1Y%A0i%5C%D4t%13%E0%D6%89%EF%9D15%C2%CDLsX%A7%04%09%1Fg8oc%81%E1%8C%8D%23%96f45%40%9A%09%C2%07%C5B%3AK%B8%408%98i%E0%F3%0D%D8%CE%81%14%E4'%26%A9%92.%8B%3C%ABER%2F%E5dE%B2%0C%F6%F0%1Fs%83%F2_%B0%A8%94%E9%9B%AD%E7%10%8Dm%9A%19N%D1%7C%8A%DE%1F9%7Dp%8C%E6%00%D5%C1%3F_%18%BDA%B8%9DpX6%E3%A35~B%CD%24%AE%11%26%BD%E7%EEti%98%EDe%9A%97Y)%12%25%1C%24%BCbT%AE3li%E6%0B%03%89%9A%E6%D3%ED%F4P%92%B0%9F4%BF43Y%F3%E3%EDP%95%04%EB1%C5%F5%F6KF%F4%BA%BD%D7%DB%91%93%07%E35%3E%A7)%D6%7F%40%FE%BD%F7%F5r%8A%E5y%92%F0%EB%B4%1E%8D%D5%F4%5B%92%3AV%DB%DB%E4%CD%A6%23%C3%C4wQ%3F%03HB%82%8E%1Cd(%E0%91B%0Ca%9Ac%C4%AA%F8L%16%19%22J%A4%D2itTy%B28%D6%3B(%93%96%ED%1CGx%C9_%0E%B8%5E%16%F5%5B%B2%B8%F6%E0%FB%9E%DD%25%D7%8E%BC%15%85%C5%B7%A3%D8Q%ED%B5%81%E9%BA%B2%13%9A%1B%7Fua%A5%A3n%E17%B9%E5%9B%1Bm%AB%0B%08Q%FE%8A%E5%B1H%5Ee%CAO%82Q%D7u6%E6%90S%97%FCu%0B%CF2%94%EE%25v%12X%0C%BA%AC%F0%5E%F8*l%0AO%85%17%C2%97%BF%D4%C8%CE%DE%AD%11%CB%80q%2C%3E%AB%9ES%CD%C6%EC%25%D2L%D2%EBd%B8%BF%8A%F5B%C6%18%F9%901CZ%9D%BE%24M%9C%8A9%F2%DAP%0B'%06w%82%EB%E6%E2%5C%2F%D7%07%9E%BB%CC%5D%E1%FA%B9%08%AD.r%23%8E%C2%17%F5E%7C!%F0%BE3%BE%3E_%B7o%88a%A7%DB%BE%D3d%EB%A31Z%EB%BB%D3%91%BA%A2%B1z%94%8F%DB'%F6%3D%8E%AA%13%19%B2%B1%BE%B1~V%08%2B%B4%A2cjJ%B3tO%00%03%25mN%97%F3%05%93%EF%11%84%0B%7C%88%AE-%89%8F%ABbW%90O%2B%0Ao%99%0C%5E%97%0CI%AFH%D9.%B0%3B%8F%ED%03%B6S%D6%5D%E6i_s9%F3*p%E9%1B%FD%C3%EB.7U%06%5E%19%C0%D1s.%17%A03u%E4%09%B0%7C%5E%2C%EB%15%DB%1F%3C%9E%B7%80%91%3B%DBc%AD%3Dma%BA%8B%3EV%AB%DBt.%5B%1E%01%BB%0F%AB%D5%9F%CF%AA%D5%DD%E7%E4%7F%0Bx%A3%FC%06%A9%23%0A%D6%C2%A1_2%00%00%00%09pHYs%00%00%0B%13%00%00%0B%13%01%00%9A%9C%18%00%00%00%3AIDAT8%11c%FC%FF%FF%7F%18%03%1A%60%01%F2%3F%A0%891%80%04%FF%11-%F8%17%9BJ%E2%05%B1ZD%81v%26t%E7%80%F8%A3%82h%A12%1A%20%A3%01%02%0F%01%BA%25%06%00%19%C0%0D%AEF%D5%3ES%00%00%00%00IEND%AEB%60%82\");\n" +
  "    background-repeat: no-repeat, repeat-x;\n" +
  "    background-position: center center, top left;\n" +
  "    color: transparent;\n" +
  "\n" +
  "    border: 1px solid black;\n" +
  "    -moz-border-radius: 2px;\n" +
  "    -webkit-border-radius: 2px;\n" +
  "    border-radius: 2px;\n" +
  "    \n" +
  "    cursor: pointer;\n" +
  "    pointer-events: auto;\n" +
  "}\n" +
  "\n" +
  ".ace_dark .ace_fold {\n" +
  "}\n" +
  "\n" +
  ".ace_fold:hover{\n" +
  "    background-image: \n" +
  "        url(\"data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%11%00%00%00%09%08%06%00%00%00%D4%E8%C7%0C%00%00%03%1EiCCPICC%20Profile%00%00x%01%85T%DFk%D3P%14%FE%DAe%9D%B0%E1%8B%3Ag%11%09%3Eh%91ndStC%9C%B6kW%BA%CDZ%EA6%B7!H%9B%A6m%5C%9A%C6%24%ED~%B0%07%D9%8Bo%3A%C5w%F1%07%3E%F9%07%0C%D9%83o%7B%92%0D%C6%14a%F8%AC%88%22L%F6%22%B3%9E%9B4M'S%03%B9%F7%BB%DF%F9%EE9'%E7%E4%5E%A0%F9qZ%D3%14%2F%0F%14USO%C5%C2%FC%C4%E4%14%DF%F2%01%5E%1CC%2B%FChM%8B%86%16J%26G%40%0F%D3%B2y%EF%B3%F3%0E%1E%C6lt%EEo%DF%AB%FEc%D5%9A%95%0C%11%F0%1C%20%BE%945%C4%22%E1Y%A0i%5C%D4t%13%E0%D6%89%EF%9D15%C2%CDLsX%A7%04%09%1Fg8oc%81%E1%8C%8D%23%96f45%40%9A%09%C2%07%C5B%3AK%B8%408%98i%E0%F3%0D%D8%CE%81%14%E4'%26%A9%92.%8B%3C%ABER%2F%E5dE%B2%0C%F6%F0%1Fs%83%F2_%B0%A8%94%E9%9B%AD%E7%10%8Dm%9A%19N%D1%7C%8A%DE%1F9%7Dp%8C%E6%00%D5%C1%3F_%18%BDA%B8%9DpX6%E3%A35~B%CD%24%AE%11%26%BD%E7%EEti%98%EDe%9A%97Y)%12%25%1C%24%BCbT%AE3li%E6%0B%03%89%9A%E6%D3%ED%F4P%92%B0%9F4%BF43Y%F3%E3%EDP%95%04%EB1%C5%F5%F6KF%F4%BA%BD%D7%DB%91%93%07%E35%3E%A7)%D6%7F%40%FE%BD%F7%F5r%8A%E5y%92%F0%EB%B4%1E%8D%D5%F4%5B%92%3AV%DB%DB%E4%CD%A6%23%C3%C4wQ%3F%03HB%82%8E%1Cd(%E0%91B%0Ca%9Ac%C4%AA%F8L%16%19%22J%A4%D2itTy%B28%D6%3B(%93%96%ED%1CGx%C9_%0E%B8%5E%16%F5%5B%B2%B8%F6%E0%FB%9E%DD%25%D7%8E%BC%15%85%C5%B7%A3%D8Q%ED%B5%81%E9%BA%B2%13%9A%1B%7Fua%A5%A3n%E17%B9%E5%9B%1Bm%AB%0B%08Q%FE%8A%E5%B1H%5Ee%CAO%82Q%D7u6%E6%90S%97%FCu%0B%CF2%94%EE%25v%12X%0C%BA%AC%F0%5E%F8*l%0AO%85%17%C2%97%BF%D4%C8%CE%DE%AD%11%CB%80q%2C%3E%AB%9ES%CD%C6%EC%25%D2L%D2%EBd%B8%BF%8A%F5B%C6%18%F9%901CZ%9D%BE%24M%9C%8A9%F2%DAP%0B'%06w%82%EB%E6%E2%5C%2F%D7%07%9E%BB%CC%5D%E1%FA%B9%08%AD.r%23%8E%C2%17%F5E%7C!%F0%BE3%BE%3E_%B7o%88a%A7%DB%BE%D3d%EB%A31Z%EB%BB%D3%91%BA%A2%B1z%94%8F%DB'%F6%3D%8E%AA%13%19%B2%B1%BE%B1~V%08%2B%B4%A2cjJ%B3tO%00%03%25mN%97%F3%05%93%EF%11%84%0B%7C%88%AE-%89%8F%ABbW%90O%2B%0Ao%99%0C%5E%97%0CI%AFH%D9.%B0%3B%8F%ED%03%B6S%D6%5D%E6i_s9%F3*p%E9%1B%FD%C3%EB.7U%06%5E%19%C0%D1s.%17%A03u%E4%09%B0%7C%5E%2C%EB%15%DB%1F%3C%9E%B7%80%91%3B%DBc%AD%3Dma%BA%8B%3EV%AB%DBt.%5B%1E%01%BB%0F%AB%D5%9F%CF%AA%D5%DD%E7%E4%7F%0Bx%A3%FC%06%A9%23%0A%D6%C2%A1_2%00%00%00%09pHYs%00%00%0B%13%00%00%0B%13%01%00%9A%9C%18%00%00%00%B5IDAT(%15%A5%91%3D%0E%02!%10%85ac%E1%05%D6%CE%D6%C6%CE%D2%E8%ED%CD%DE%C0%C6%D6N.%E0V%F8%3D%9Ca%891XH%C2%BE%D9y%3F%90!%E6%9C%C3%BFk%E5%011%C6-%F5%C8N%04%DF%BD%FF%89%DFt%83DN%60%3E%F3%AB%A0%DE%1A%5Dg%BE%10Q%97%1B%40%9C%A8o%10%8F%5E%828%B4%1B%60%87%F6%02%26%85%1Ch%1E%C1%2B%5Bk%FF%86%EE%B7j%09%9A%DA%9B%ACe%A3%F9%EC%DA!9%B4%D5%A6%81%86%86%98%CC%3C%5B%40%FA%81%B3%E9%CB%23%94%C16Azo%05%D4%E1%C1%95a%3B%8A'%A0%E8%CC%17%22%85%1D%BA%00%A2%FA%DC%0A%94%D1%D1%8D%8B%3A%84%17B%C7%60%1A%25Z%FC%8D%00%00%00%00IEND%AEB%60%82\"),\n" +
  "        url(\"data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%05%00%00%007%08%06%00%00%00%C4%DD%80C%00%00%03%1EiCCPICC%20Profile%00%00x%01%85T%DFk%D3P%14%FE%DAe%9D%B0%E1%8B%3Ag%11%09%3Eh%91ndStC%9C%B6kW%BA%CDZ%EA6%B7!H%9B%A6m%5C%9A%C6%24%ED~%B0%07%D9%8Bo%3A%C5w%F1%07%3E%F9%07%0C%D9%83o%7B%92%0D%C6%14a%F8%AC%88%22L%F6%22%B3%9E%9B4M'S%03%B9%F7%BB%DF%F9%EE9'%E7%E4%5E%A0%F9qZ%D3%14%2F%0F%14USO%C5%C2%FC%C4%E4%14%DF%F2%01%5E%1CC%2B%FChM%8B%86%16J%26G%40%0F%D3%B2y%EF%B3%F3%0E%1E%C6lt%EEo%DF%AB%FEc%D5%9A%95%0C%11%F0%1C%20%BE%945%C4%22%E1Y%A0i%5C%D4t%13%E0%D6%89%EF%9D15%C2%CDLsX%A7%04%09%1Fg8oc%81%E1%8C%8D%23%96f45%40%9A%09%C2%07%C5B%3AK%B8%408%98i%E0%F3%0D%D8%CE%81%14%E4'%26%A9%92.%8B%3C%ABER%2F%E5dE%B2%0C%F6%F0%1Fs%83%F2_%B0%A8%94%E9%9B%AD%E7%10%8Dm%9A%19N%D1%7C%8A%DE%1F9%7Dp%8C%E6%00%D5%C1%3F_%18%BDA%B8%9DpX6%E3%A35~B%CD%24%AE%11%26%BD%E7%EEti%98%EDe%9A%97Y)%12%25%1C%24%BCbT%AE3li%E6%0B%03%89%9A%E6%D3%ED%F4P%92%B0%9F4%BF43Y%F3%E3%EDP%95%04%EB1%C5%F5%F6KF%F4%BA%BD%D7%DB%91%93%07%E35%3E%A7)%D6%7F%40%FE%BD%F7%F5r%8A%E5y%92%F0%EB%B4%1E%8D%D5%F4%5B%92%3AV%DB%DB%E4%CD%A6%23%C3%C4wQ%3F%03HB%82%8E%1Cd(%E0%91B%0Ca%9Ac%C4%AA%F8L%16%19%22J%A4%D2itTy%B28%D6%3B(%93%96%ED%1CGx%C9_%0E%B8%5E%16%F5%5B%B2%B8%F6%E0%FB%9E%DD%25%D7%8E%BC%15%85%C5%B7%A3%D8Q%ED%B5%81%E9%BA%B2%13%9A%1B%7Fua%A5%A3n%E17%B9%E5%9B%1Bm%AB%0B%08Q%FE%8A%E5%B1H%5Ee%CAO%82Q%D7u6%E6%90S%97%FCu%0B%CF2%94%EE%25v%12X%0C%BA%AC%F0%5E%F8*l%0AO%85%17%C2%97%BF%D4%C8%CE%DE%AD%11%CB%80q%2C%3E%AB%9ES%CD%C6%EC%25%D2L%D2%EBd%B8%BF%8A%F5B%C6%18%F9%901CZ%9D%BE%24M%9C%8A9%F2%DAP%0B'%06w%82%EB%E6%E2%5C%2F%D7%07%9E%BB%CC%5D%E1%FA%B9%08%AD.r%23%8E%C2%17%F5E%7C!%F0%BE3%BE%3E_%B7o%88a%A7%DB%BE%D3d%EB%A31Z%EB%BB%D3%91%BA%A2%B1z%94%8F%DB'%F6%3D%8E%AA%13%19%B2%B1%BE%B1~V%08%2B%B4%A2cjJ%B3tO%00%03%25mN%97%F3%05%93%EF%11%84%0B%7C%88%AE-%89%8F%ABbW%90O%2B%0Ao%99%0C%5E%97%0CI%AFH%D9.%B0%3B%8F%ED%03%B6S%D6%5D%E6i_s9%F3*p%E9%1B%FD%C3%EB.7U%06%5E%19%C0%D1s.%17%A03u%E4%09%B0%7C%5E%2C%EB%15%DB%1F%3C%9E%B7%80%91%3B%DBc%AD%3Dma%BA%8B%3EV%AB%DBt.%5B%1E%01%BB%0F%AB%D5%9F%CF%AA%D5%DD%E7%E4%7F%0Bx%A3%FC%06%A9%23%0A%D6%C2%A1_2%00%00%00%09pHYs%00%00%0B%13%00%00%0B%13%01%00%9A%9C%18%00%00%003IDAT8%11c%FC%FF%FF%7F%3E%03%1A%60%01%F2%3F%A3%891%80%04%FFQ%26%F8w%C0%B43%A1%DB%0C%E2%8F%0A%A2%85%CAh%80%8C%06%08%3C%04%E8%96%18%00%A3S%0D%CD%CF%D8%C1%9D%00%00%00%00IEND%AEB%60%82\");\n" +
  "    background-repeat: no-repeat, repeat-x;\n" +
  "    background-position: center center, top left;\n" +
  "}\n" +
  "\n" +
  ".ace_dragging .ace_content {\n" +
  "    cursor: move;\n" +
  "}\n" +
  "\n" +
  ".ace_folding-enabled > .ace_gutter-cell {\n" +
  "    padding-right: 13px;\n" +
  "}\n" +
  "\n" +
  ".ace_fold-widget {\n" +
  "    box-sizing: border-box;\n" +
  "    -moz-box-sizing: border-box;\n" +
  "    -webkit-box-sizing: border-box;\n" +
  "\n" +
  "    margin: 0 -12px 1px 1px;\n" +
  "    display: inline-block;\n" +
  "    height: 14px;\n" +
  "    width: 11px;\n" +
  "    vertical-align: text-bottom;\n" +
  "    \n" +
  "    background-image: url(\"data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%05%00%00%00%05%08%06%00%00%00%8Do%26%E5%00%00%004IDATx%DAe%8A%B1%0D%000%0C%C2%F2%2CK%96%BC%D0%8F9%81%88H%E9%D0%0E%96%C0%10%92%3E%02%80%5E%82%E4%A9*-%EEsw%C8%CC%11%EE%96w%D8%DC%E9*Eh%0C%151(%00%00%00%00IEND%AEB%60%82\");\n" +
  "    background-repeat: no-repeat;\n" +
  "    background-position: center 5px;\n" +
  "\n" +
  "    border-radius: 3px;\n" +
  "}\n" +
  "\n" +
  ".ace_fold-widget.end {\n" +
  "    background-image: url(\"data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%05%00%00%00%05%08%06%00%00%00%8Do%26%E5%00%00%004IDATx%DAm%C7%C1%09%000%08C%D1%8C%ECE%C8E(%8E%EC%02)%1EZJ%F1%C1'%04%07I%E1%E5%EE%CAL%F5%A2%99%99%22%E2%D6%1FU%B5%FE0%D9x%A7%26Wz5%0E%D5%00%00%00%00IEND%AEB%60%82\");\n" +
  "}\n" +
  "\n" +
  ".ace_fold-widget.closed {\n" +
  "    background-image: url(\"data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%03%00%00%00%06%08%06%00%00%00%06%E5%24%0C%00%00%009IDATx%DA5%CA%C1%09%000%08%03%C0%AC*(%3E%04%C1%0D%BA%B1%23%A4Uh%E0%20%81%C0%CC%F8%82%81%AA%A2%AArGfr%88%08%11%11%1C%DD%7D%E0%EE%5B%F6%F6%CB%B8%05Q%2F%E9tai%D9%00%00%00%00IEND%AEB%60%82\");\n" +
  "}\n" +
  "\n" +
  ".ace_fold-widget:hover {\n" +
  "    border: 1px solid rgba(0, 0, 0, 0.3);\n" +
  "    background-color: rgba(255, 255, 255, 0.2);\n" +
  "    -moz-box-shadow:inset 0 1px 1px rgba(255, 255, 255, 0.7);\n" +
  "    -moz-box-shadow: 0 1px 1px rgba(255, 255, 255, 0.7);\n" +
  "    -webkit-box-shadow:inset 0 1px 1px rgba(255, 255, 255, 0.7);\n" +
  "    -webkit-box-shadow: 0 1px 1px rgba(255, 255, 255, 0.7);\n" +
  "    box-shadow:inset 0 1px 1px rgba(255, 255, 255, 0.7);\n" +
  "    box-shadow: 0 1px 1px rgba(255, 255, 255, 0.7);\n" +
  "    background-position: center 4px;\n" +
  "}\n" +
  "\n" +
  ".ace_fold-widget:active {\n" +
  "    border: 1px solid rgba(0, 0, 0, 0.4);\n" +
  "    background-color: rgba(0, 0, 0, 0.05);\n" +
  "    -moz-box-shadow:inset 0 1px 1px rgba(255, 255, 255);\n" +
  "    -moz-box-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);\n" +
  "    -webkit-box-shadow:inset 0 1px 1px rgba(255, 255, 255);\n" +
  "    -webkit-box-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);\n" +
  "    box-shadow:inset 0 1px 1px rgba(255, 255, 255);\n" +
  "    box-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);\n" +
  "}\n" +
  "\n" +
  ".ace_fold-widget.invalid {\n" +
  "    background-color: #FFB4B4;\n" +
  "    border-color: #DE5555;\n" +
  "}\n" +
  "\n" +
  ".ace_fade-fold-widgets .ace_fold-widget {\n" +
  "    -moz-transition: 0.5s opacity;\n" +
  "    -webkit-transition: 0.5s opacity;\n" +
  "    -o-transition: 0.5s opacity;\n" +
  "    -ms-transition: 0.5s opacity;\n" +
  "    transition: 0.5s opacity;\n" +
  "    opacity: 0;\n" +
  "}\n" +
  ".ace_fade-fold-widgets:hover .ace_fold-widget {\n" +
  "    -moz-transition-duration: 0.05s;\n" +
  "    -webkit-transition-duration: 0.05s;\n" +
  "    -o-transition-duration: 0.05s;\n" +
  "    -ms-transition-duration: 0.05s;\n" +
  "    transition-duration: 0.05s;\n" +
  "    -moz-transition-delay: 0.2s;\n" +
  "    -webkit-transition-delay: 0.2s;\n" +
  "    -o-transition-delay: 0.2s;\n" +
  "    -ms-transition-delay: 0.2s;\n" +
  "    transition-delay: 0.2s;	\n" +
  "    opacity:1;\n" +
  "}\n" +
  "");

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
 *      Harutyun Amirjanyan <amirjanyan AT gmail DOT com>
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

ace.define('ace/multi_select', ['require', 'exports', 'module' , 'ace/range_list', 'ace/range', 'ace/selection', 'ace/mouse/multi_select_handler', 'ace/lib/event', 'ace/commands/multi_select_commands', 'ace/search', 'ace/edit_session', 'ace/editor'], function(require, exports, module) {

var RangeList = require("./range_list").RangeList;
var Range = require("./range").Range;
var Selection = require("./selection").Selection;
var onMouseDown = require("./mouse/multi_select_handler").onMouseDown;
var event = require("./lib/event");
exports.commands = require("./commands/multi_select_commands");

// Todo: session.find or editor.findVolatile that returns range
var Search = require("./search").Search;
var search = new Search();

function find(session, needle, dir) {
    search.$options.wrap = true;
    search.$options.needle = needle;
    search.$options.backwards = dir == -1;
    return search.find(session);
}

// extend EditSession
var EditSession = require("./edit_session").EditSession;
(function() {
    this.getSelectionMarkers = function() {
        return this.$selectionMarkers;
    };
}).call(EditSession.prototype);

// extend Selection
(function() {
    // list of ranges in reverse addition order
    this.ranges = null;

    // automatically sorted list of ranges
    this.rangeList = null;

    /** extension
     * Selection.addRange(range, $blockChangeEvents) 
     * - range (Range): The new range to add
     * - $blockChangeEvents (Boolean): Whether or not to block changing events
     *
     * Adds a range to a selection by entering multiselect mode, if necessary.
     **/
    this.addRange = function(range, $blockChangeEvents) {
        if (!range)
            return;

        if (!this.inMultiSelectMode && this.rangeCount == 0) {
            var oldRange = this.toOrientedRange();
            if (range.intersects(oldRange))
                return $blockChangeEvents || this.fromOrientedRange(range);

            this.rangeList.add(oldRange);
            this.$onAddRange(oldRange);
        }

        if (!range.cursor)
            range.cursor = range.end;

        var removed = this.rangeList.add(range);

        this.$onAddRange(range);

        if (removed.length)
            this.$onRemoveRange(removed);

        if (this.rangeCount > 1 && !this.inMultiSelectMode) {
            this._emit("multiSelect");
            this.inMultiSelectMode = true;
            this.session.$undoSelect = false;
            this.rangeList.attach(this.session);
        }

        return $blockChangeEvents || this.fromOrientedRange(range);
    };

    this.toSingleRange = function(range) {
        range = range || this.ranges[0];
        var removed = this.rangeList.removeAll();
        if (removed.length)
            this.$onRemoveRange(removed);

        range && this.fromOrientedRange(range);
    };
    
    /** extension
     * Selection.substractPoint(pos) -> Range
     * - pos (Range): The position to remove, as a `{row, column}` object
     *
     * Removes a Range containing pos (if it exists).
     **/
    this.substractPoint = function(pos) {
        var removed = this.rangeList.substractPoint(pos);
        if (removed) {
            this.$onRemoveRange(removed);
            return removed[0];
        }
    };

    /** extension
     * Selection.mergeOverlappingRanges() 
     *
     * Merges overlapping ranges ensuring consistency after changes
     **/
    this.mergeOverlappingRanges = function() {
        var removed = this.rangeList.merge();
        if (removed.length)
            this.$onRemoveRange(removed);
        else if(this.ranges[0])
            this.fromOrientedRange(this.ranges[0]);
    };

    this.$onAddRange = function(range) {
        this.rangeCount = this.rangeList.ranges.length;
        this.ranges.unshift(range);
        this._emit("addRange", {range: range});
    };

    this.$onRemoveRange = function(removed) {
        this.rangeCount = this.rangeList.ranges.length;
        if (this.rangeCount == 1 && this.inMultiSelectMode) {
            var lastRange = this.rangeList.ranges.pop();
            removed.push(lastRange);
            this.rangeCount = 0;
        }

        for (var i = removed.length; i--; ) {
            var index = this.ranges.indexOf(removed[i]);
            this.ranges.splice(index, 1);
        }

        this._emit("removeRange", {ranges: removed});

        if (this.rangeCount == 0 && this.inMultiSelectMode) {
            this.inMultiSelectMode = false;
            this._emit("singleSelect");
            this.session.$undoSelect = true;
            this.rangeList.detach(this.session);
        }

        lastRange = lastRange || this.ranges[0];
        if (lastRange && !lastRange.isEqual(this.getRange()))
            this.fromOrientedRange(lastRange);
    };

    // adds multicursor support to selection
    this.$initRangeList = function() {
        if (this.rangeList)
            return;

        this.rangeList = new RangeList();
        this.ranges = [];
        this.rangeCount = 0;
    };

    this.getAllRanges = function() {
        return this.rangeList.ranges.concat();
    };

    this.splitIntoLines = function () {
        if (this.rangeCount > 1) {
            var ranges = this.rangeList.ranges;
            var lastRange = ranges[ranges.length - 1];
            var range = Range.fromPoints(ranges[0].start, lastRange.end);

            this.toSingleRange();
            this.setSelectionRange(range, lastRange.cursor == lastRange.start);
        } else {
            var range = this.getRange();
            var startRow = range.start.row;
            var endRow = range.end.row;
            if (startRow == endRow)
                return;

            var rectSel = [];
            var r = this.getLineRange(startRow, true);
            r.start.column = range.start.column;
            rectSel.push(r);

            for (var i = startRow + 1; i < endRow; i++)
                rectSel.push(this.getLineRange(i, true));

            r = this.getLineRange(endRow, true);
            r.end.column = range.end.column;
            rectSel.push(r);

            rectSel.forEach(this.addRange, this);
        }
    };

    this.toggleBlockSelection = function () {
        if (this.rangeCount > 1) {
            var ranges = this.rangeList.ranges;
            var lastRange = ranges[ranges.length - 1];
            var range = Range.fromPoints(ranges[0].start, lastRange.end);

            this.toSingleRange();
            this.setSelectionRange(range, lastRange.cursor == lastRange.start);
        } else {
            var cursor = this.session.documentToScreenPosition(this.selectionLead);
            var anchor = this.session.documentToScreenPosition(this.selectionAnchor);

            var rectSel = this.rectangularRangeBlock(cursor, anchor);
            rectSel.forEach(this.addRange, this);
        }
    };

    /** extension
     * Selection.rectangularRangeBlock(screenCursor, screenAnchor, includeEmptyLines) -> Range
     * - screenCursor (Cursor): The cursor to use
     * - screenAnchor (Anchor): The anchor to use
     * - includeEmptyLins (Boolean): If true, this includes ranges inside the block which are empty due to clipping
     *  
     * Gets list of ranges composing rectangular block on the screen
     *
     */
    this.rectangularRangeBlock = function(screenCursor, screenAnchor, includeEmptyLines) {
        var rectSel = [];

        var xBackwards = screenCursor.column < screenAnchor.column;
        if (xBackwards) {
            var startColumn = screenCursor.column;
            var endColumn = screenAnchor.column;
        } else {
            var startColumn = screenAnchor.column;
            var endColumn = screenCursor.column;
        }

        var yBackwards = screenCursor.row < screenAnchor.row;
        if (yBackwards) {
            var startRow = screenCursor.row;
            var endRow = screenAnchor.row;
        } else {
            var startRow = screenAnchor.row;
            var endRow = screenCursor.row;
        }

        if (startColumn < 0)
            startColumn = 0;
        if (startRow < 0)
            startRow = 0;

        if (startRow == endRow)
            includeEmptyLines = true;

        for (var row = startRow; row <= endRow; row++) {
            var range = Range.fromPoints(
                this.session.screenToDocumentPosition(row, startColumn),
                this.session.screenToDocumentPosition(row, endColumn)
            );
            if (range.isEmpty()) {
                if (docEnd && isSamePoint(range.end, docEnd))
                    break;
                var docEnd = range.end;
            }
            range.cursor = xBackwards ? range.start : range.end;
            rectSel.push(range);
        }

        if (yBackwards)
            rectSel.reverse();

        if (!includeEmptyLines) {
            var end = rectSel.length - 1;
            while (rectSel[end].isEmpty() && end > 0)
                end--;
            if (end > 0) {
                var start = 0;
                while (rectSel[start].isEmpty())
                    start++;
            }
            for (var i = end; i >= start; i--) {
                if (rectSel[i].isEmpty())
                    rectSel.splice(i, 1);
            }
        }

        return rectSel;
    };
}).call(Selection.prototype);

// extend Editor
var Editor = require("./editor").Editor;
(function() {
    
    /** extension
     * Editor.updateSelectionMarkers() 
     *
     * Updates the cursor and marker layers.
     **/
    this.updateSelectionMarkers = function() {
        this.renderer.updateCursor();
        this.renderer.updateBackMarkers();
    };

    /** extension
     * Editor.addSelectionMarker(orientedRange) -> Range
     * - orientedRange (Range): A range containing a cursor
     *
     * Adds the selection and cursor.
     **/
    this.addSelectionMarker = function(orientedRange) {
        if (!orientedRange.cursor)
            orientedRange.cursor = orientedRange.end;

        var style = this.getSelectionStyle();
        orientedRange.marker = this.session.addMarker(orientedRange, "ace_selection", style);

        this.session.$selectionMarkers.push(orientedRange);
        this.session.selectionMarkerCount = this.session.$selectionMarkers.length;
        return orientedRange;
    };

    /** extension
     * Editor.removeSelectionMarker(range) 
     * - range (Range): The selection range added with [[Editor.addSelectionMarker `addSelectionMarker()`]].
     *
     * Removes the selection marker.
     **/
    this.removeSelectionMarker = function(range) {
        if (!range.marker)
            return;
        this.session.removeMarker(range.marker);
        var index = this.session.$selectionMarkers.indexOf(range);
        if (index != -1)
            this.session.$selectionMarkers.splice(index, 1);
        this.session.selectionMarkerCount = this.session.$selectionMarkers.length;
    };

    this.removeSelectionMarkers = function(ranges) {
        var markerList = this.session.$selectionMarkers;
        for (var i = ranges.length; i--; ) {
            var range = ranges[i];
            if (!range.marker)
                continue;
            this.session.removeMarker(range.marker);
            var index = markerList.indexOf(range);
            if (index != -1)
                markerList.splice(index, 1);
        }
        this.session.selectionMarkerCount = markerList.length;
    };

    this.$onAddRange = function(e) {
        this.addSelectionMarker(e.range);
        this.renderer.updateCursor();
        this.renderer.updateBackMarkers();
    };

    this.$onRemoveRange = function(e) {
        this.removeSelectionMarkers(e.ranges);
        this.renderer.updateCursor();
        this.renderer.updateBackMarkers();
    };

    this.$onMultiSelect = function(e) {
        if (this.inMultiSelectMode)
            return;
        this.inMultiSelectMode = true;

        this.setStyle("multiselect");
        this.keyBinding.addKeyboardHandler(exports.commands.keyboardHandler);
        this.commands.on("exec", this.$onMultiSelectExec);

        this.renderer.updateCursor();
        this.renderer.updateBackMarkers();
    };

    this.$onSingleSelect = function(e) {
        if (this.session.multiSelect.inVirtualMode)
            return;
        this.inMultiSelectMode = false;

        this.unsetStyle("multiselect");
        this.keyBinding.removeKeyboardHandler(exports.commands.keyboardHandler);

        this.commands.removeEventListener("exec", this.$onMultiSelectExec);
        this.renderer.updateCursor();
        this.renderer.updateBackMarkers();
    };

    this.$onMultiSelectExec = function(e) {
        var command = e.command;
        var editor = e.editor;
        if (!command.multiSelectAction) {
            command.exec(editor, e.args || {});
            editor.multiSelect.addRange(editor.multiSelect.toOrientedRange());
            editor.multiSelect.mergeOverlappingRanges();
        } else if (command.multiSelectAction == "forEach") {
            editor.forEachSelection(command, e.args);
        } else if (command.multiSelectAction == "single") {
            editor.exitMultiSelectMode();
            command.exec(editor, e.args || {});
        } else {
            command.multiSelectAction(editor, e.args || {});
        }
        e.preventDefault();
    };

    /** extension
     * Editor.forEachSelection(cmd, args) 
     * - cmd (String): The command to execute
     * - args (String): Any arguments for the command
     *
     * Executes a command for each selection range.
     **/
    this.forEachSelection = function(cmd, args) {
        if (this.inVirtualSelectionMode)
            return;

        var session = this.session;
        var selection = this.selection;
        var rangeList = selection.rangeList;

        var reg = selection._eventRegistry;
        selection._eventRegistry = {};

        var tmpSel = new Selection(session);
        this.inVirtualSelectionMode = true;
        for (var i = rangeList.ranges.length; i--;) {
            tmpSel.fromOrientedRange(rangeList.ranges[i]);
            this.selection = session.selection = tmpSel;
            cmd.exec(this, args || {});
            tmpSel.toOrientedRange(rangeList.ranges[i]);
        }
        tmpSel.detach();

        this.selection = session.selection = selection;
        this.inVirtualSelectionMode = false;
        selection._eventRegistry = reg;
        selection.mergeOverlappingRanges();

        this.onCursorChange();
        this.onSelectionChange();
    };

    /** extension
    * Editor.exitMultiSelectMode() -> Void
    *
    * Removes all the selections except the last added one.
    **/
    this.exitMultiSelectMode = function() {
        if (this.inVirtualSelectionMode)
            return;
        this.multiSelect.toSingleRange();
    };

    this.getCopyText = function() {
        var text = "";
        if (this.inMultiSelectMode) {
            var ranges = this.multiSelect.rangeList.ranges;
            text = [];
            for (var i = 0; i < ranges.length; i++) {
                text.push(this.session.getTextRange(ranges[i]));
            }
            text = text.join(this.session.getDocument().getNewLineCharacter());
        } else if (!this.selection.isEmpty()) {
            text = this.session.getTextRange(this.getSelectionRange());
        }

        return text;
    };

    this.onPaste = function(text) {
        this._emit("paste", text);
        if (!this.inMultiSelectMode)
            return this.insert(text);

        var lines = text.split(this.session.getDocument().getNewLineCharacter());
        var ranges = this.selection.rangeList.ranges;

        if (lines.length > ranges.length) {
            this.commands.exec("insertstring", this, text);
            return;
        }

        for (var i = ranges.length; i--; ) {
            var range = ranges[i];
            if (!range.isEmpty())
                this.session.remove(range);

            this.session.insert(range.start, lines[i]);
        }
    };

    /** extension
     * Editor.findAll(dir, options) -> Number
     * - needle: text to find
     * - options: search options
     * - additive: keeps
     *
     * Finds and selects all the occurences of `needle`.
     **/
    this.findAll = function(needle, options, additive) {
        options = options || {};
        options.needle = needle || options.needle;
        this.$search.set(options);

        var ranges = this.$search.findAll(this.session);
        if (!ranges.length)
            return 0;

        this.$blockScrolling += 1;
        var selection = this.multiSelect;

        if (!additive)
            selection.toSingleRange(ranges[0]);

        for (var i = ranges.length; i--; )
            selection.addRange(ranges[i], true);

        this.$blockScrolling -= 1;

        return ranges.length;
    };

    // commands
    /** extension
     * Editor.selectMoreLines(dir, skip) 
     * - dir (Number): The direction of lines to select: -1 for up, 1 for down
     * - skip (Boolean): If `true`, removes the active selection range
     *
     * Adds a cursor above or below the active cursor.
     **/
    this.selectMoreLines = function(dir, skip) {
        var range = this.selection.toOrientedRange();
        var isBackwards = range.cursor == range.end;

        var screenLead = this.session.documentToScreenPosition(range.cursor);
        if (this.selection.$desiredColumn)
            screenLead.column = this.selection.$desiredColumn;

        var lead = this.session.screenToDocumentPosition(screenLead.row + dir, screenLead.column);

        if (!range.isEmpty()) {
            var screenAnchor = this.session.documentToScreenPosition(isBackwards ? range.end : range.start);
            var anchor = this.session.screenToDocumentPosition(screenAnchor.row + dir, screenAnchor.column);
        } else {
            var anchor = lead;
        }

        if (isBackwards) {
            var newRange = Range.fromPoints(lead, anchor);
            newRange.cursor = newRange.start;
        } else {
            var newRange = Range.fromPoints(anchor, lead);
            newRange.cursor = newRange.end;
        }

        newRange.desiredColumn = screenLead.column;
        if (!this.selection.inMultiSelectMode) {
            this.selection.addRange(range);
        } else {
            if (skip)
                var toRemove = range.cursor;
        }

        this.selection.addRange(newRange);
        if (toRemove)
            this.selection.substractPoint(toRemove);
    };

    /** extension
     * Editor.transposeSelections(dir) 
     * - dir (Number): The direction to rotate selections
     *
     * Transposes the selected ranges. 
     **/
    this.transposeSelections = function(dir) {
        var session = this.session;
        var sel = session.multiSelect;
        var all = sel.ranges;

        for (var i = all.length; i--; ) {
            var range = all[i];
            if (range.isEmpty()) {
                var tmp = session.getWordRange(range.start.row, range.start.column);
                range.start.row = tmp.start.row;
                range.start.column = tmp.start.column;
                range.end.row = tmp.end.row;
                range.end.column = tmp.end.column;
            }
        }
        sel.mergeOverlappingRanges();

        var words = [];
        for (var i = all.length; i--; ) {
            var range = all[i];
            words.unshift(session.getTextRange(range));
        }

        if (dir < 0)
            words.unshift(words.pop());
        else
            words.push(words.shift());

        for (var i = all.length; i--; ) {
            var range = all[i];
            var tmp = range.clone();
            session.replace(range, words[i]);
            range.start.row = tmp.start.row;
            range.start.column = tmp.start.column;
        }
    }

    /** extension
     * Editor.selectMore(dir, skip) 
     * - dir (Number): The direction of lines to select: -1 for up, 1 for down
     * - skip (Boolean): If `true`, removes the active selection range
     *
     * Finds the next occurence of text in an active selection and adds it to the selections.
     **/
    this.selectMore = function (dir, skip) {
        var session = this.session;
        var sel = session.multiSelect;

        var range = sel.toOrientedRange();
        if (range.isEmpty()) {
            var range = session.getWordRange(range.start.row, range.start.column);
            range.cursor = range.end;
            this.multiSelect.addRange(range);
        }
        var needle = session.getTextRange(range);

        var newRange = find(session, needle, dir);
        if (newRange) {
            newRange.cursor = dir == -1 ? newRange.start : newRange.end;
            this.multiSelect.addRange(newRange);
        }
        if (skip)
            this.multiSelect.substractPoint(range.cursor);
    };
}).call(Editor.prototype);


function isSamePoint(p1, p2) {
    return p1.row == p2.row && p1.column == p2.column;
}

// patch
// adds multicursor support to a session
exports.onSessionChange = function(e) {
    var session = e.session;
    if (!session.multiSelect) {
        session.$selectionMarkers = [];
        session.selection.$initRangeList();
        session.multiSelect = session.selection;
    }
    this.multiSelect = session.multiSelect;

    var oldSession = e.oldSession;
    if (oldSession) {
        // todo use events
        if (oldSession.multiSelect && oldSession.multiSelect.editor == this)
            oldSession.multiSelect.editor = null;

        session.multiSelect.removeEventListener("addRange", this.$onAddRange);
        session.multiSelect.removeEventListener("removeRange", this.$onRemoveRange);
        session.multiSelect.removeEventListener("multiSelect", this.$onMultiSelect);
        session.multiSelect.removeEventListener("singleSelect", this.$onSingleSelect);
    }

    session.multiSelect.on("addRange", this.$onAddRange);
    session.multiSelect.on("removeRange", this.$onRemoveRange);
    session.multiSelect.on("multiSelect", this.$onMultiSelect);
    session.multiSelect.on("singleSelect", this.$onSingleSelect);

    // this.$onSelectionChange = this.onSelectionChange.bind(this);

    if (this.inMultiSelectMode != session.selection.inMultiSelectMode) {
        if (session.selection.inMultiSelectMode)
            this.$onMultiSelect();
        else
            this.$onSingleSelect();
    }
};

// MultiSelect(editor) 
// adds multiple selection support to the editor
// (note: should be called only once for each editor instance)
function MultiSelect(editor) {
    editor.$onAddRange = editor.$onAddRange.bind(editor);
    editor.$onRemoveRange = editor.$onRemoveRange.bind(editor);
    editor.$onMultiSelect = editor.$onMultiSelect.bind(editor);
    editor.$onSingleSelect = editor.$onSingleSelect.bind(editor);

    exports.onSessionChange.call(editor, editor);
    editor.on("changeSession", exports.onSessionChange.bind(editor));

    editor.on("mousedown", onMouseDown);
    editor.commands.addCommands(exports.commands.defaultCommands);

    addAltCursorListeners(editor);
}

function addAltCursorListeners(editor){
    var el = editor.textInput.getElement();
    var altCursor = false;
    var contentEl = editor.renderer.content;
    event.addListener(el, "keydown", function(e) {
        if (e.keyCode == 18 && !(e.ctrlKey || e.shiftKey || e.metaKey)) {
            if (!altCursor) {
                contentEl.style.cursor = "crosshair";
                altCursor = true;
            }
        } else if (altCursor) {
            contentEl.style.cursor = "";
        }
    });

    event.addListener(el, "keyup", reset);
    event.addListener(el, "blur", reset);
    function reset() {
        if (altCursor) {
            contentEl.style.cursor = "";
            altCursor = false;
        }
    }
}

exports.MultiSelect = MultiSelect;

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
 *      Harutyun Amirjanyan <amirjanyan AT gmail DOT com>
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

ace.define('ace/range_list', ['require', 'exports', 'module' ], function(require, exports, module) {
"use strict";


var RangeList = function() {
    this.ranges = [];
};

(function() {
    this.comparePoints = function(p1, p2) {
        return p1.row - p2.row || p1.column - p2.column;
    };

    this.pointIndex = function(pos, startIndex) {
        var list = this.ranges;

        for (var i = startIndex || 0; i < list.length; i++) {
            var range = list[i];
            var cmp = this.comparePoints(pos, range.end);

            if (cmp > 0)
                continue;
            if (cmp == 0)
                return i;
            cmp = this.comparePoints(pos, range.start);
            if (cmp >= 0)
                return i;

            return -i-1;
        }
        return -i - 1;
    };

    this.add = function(range) {
        var startIndex = this.pointIndex(range.start);
        if (startIndex < 0)
            startIndex = -startIndex - 1;

        var endIndex = this.pointIndex(range.end, startIndex);

        if (endIndex < 0)
            endIndex = -endIndex - 1;
        else
            endIndex++;

        return this.ranges.splice(startIndex, endIndex - startIndex, range);
    };

    this.addList = function(list) {
        var removed = [];
        for (var i = list.length; i--; ) {
            removed.push.call(removed, this.add(list[i]));
        }
        return removed;
    };

    this.substractPoint = function(pos) {
        var i = this.pointIndex(pos);

        if (i >= 0)
            return this.ranges.splice(i, 1);
    };

    // merge overlapping ranges
    this.merge = function() {
        var removed = [];
        var list = this.ranges;
        var next = list[0], range;
        for (var i = 1; i < list.length; i++) {
            range = next;
            next = list[i];
            var cmp = this.comparePoints(range.end, next.start);
            if (cmp < 0)
                continue;

            if (cmp == 0 && !(range.isEmpty() || next.isEmpty()))
                continue;

            if (this.comparePoints(range.end, next.end) < 0) {
                range.end.row = next.end.row;
                range.end.column = next.end.column;
            }

            list.splice(i, 1);
            removed.push(next);
            next = range;
            i--;
        }

        return removed;
    };

    this.contains = function(row, column) {
        return this.pointIndex({row: row, column: column}) >= 0;
    };

    this.containsPoint = function(pos) {
        return this.pointIndex(pos) >= 0;
    };

    this.rangeAtPoint = function(pos) {
        var i = this.pointIndex(pos);
        if (i >= 0)
            return this.ranges[i];
    };


    this.clipRows = function(startRow, endRow) {
        var list = this.ranges;
        if (list[0].start.row > endRow || list[list.length - 1].start.row < startRow)
            return [];

        var startIndex = this.pointIndex({row: startRow, column: 0});
        if (startIndex < 0)
            startIndex = -startIndex - 1;
        var endIndex = this.pointIndex({row: endRow, column: 0}, startIndex);
        if (endIndex < 0)
            endIndex = -endIndex - 1;

        var clipped = [];
        for (var i = startIndex; i < endIndex; i++) {
            clipped.push(list[i]);
        }
        return clipped;
    };

    this.removeAll = function() {
        return this.ranges.splice(0, this.ranges.length);
    };

    this.attach = function(session) {
        if (this.session)
            this.detach();

        this.session = session;
        this.onChange = this.$onChange.bind(this);

        this.session.on('change', this.onChange);
    };

    this.detach = function() {
        if (!this.session)
            return;
        this.session.removeListener('change', this.onChange);
        this.session = null;
    };

    this.$onChange = function(e) {
        var changeRange = e.data.range;
        if (e.data.action[0] == "i"){
            var start = changeRange.start;
            var end = changeRange.end;
        } else {
            var end = changeRange.start;
            var start = changeRange.end;
        }
        var startRow = start.row;
        var endRow = end.row;
        var lineDif = endRow - startRow;

        var colDiff = -start.column + end.column;

        var ranges = this.ranges;

        for (var i=0, n = ranges.length; i < n; i++) {
            var r = ranges[i];
            if (r.end.row < startRow)
                continue;
            if (r.start.row > startRow)
                break;

            if (r.start.row == startRow && r.start.column >= start.column ) {
                r.start.column += colDiff;
                r.start.row += lineDif;
            }
            if (r.end.row == startRow && r.end.column >=  start.column) {
                r.end.column += colDiff;
                r.end.row += lineDif;
            }
        }

        if (lineDif != 0 && i < n) {
            for (; i < n; i++) {
                var r = ranges[i];
                r.start.row += lineDif;
                r.end.row += lineDif;
            }
        }
    };

}).call(RangeList.prototype);

exports.RangeList = RangeList;
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
 *      Harutyun Amirjanyan <amirjanyan AT gmail DOT com>
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

ace.define('ace/mouse/multi_select_handler', ['require', 'exports', 'module' , 'ace/lib/event'], function(require, exports, module) {

var event = require("../lib/event");


// mouse
function isSamePoint(p1, p2) {
    return p1.row == p2.row && p1.column == p2.column;
}

function onMouseDown(e) {
    var ev = e.domEvent;
    var alt = ev.altKey;
    var shift = ev.shiftKey;
    var ctrl = e.getAccelKey();
    var button = e.getButton();

    if (!ctrl && !alt) {
        if (e.editor.inMultiSelectMode) {
            if (button == 0) {
                e.editor.exitMultiSelectMode();
            } else if (button == 2) {
                var editor = e.editor;
                var selectionEmpty = editor.selection.isEmpty();
                editor.textInput.onContextMenu({x: e.clientX, y: e.clientY}, selectionEmpty);
                event.capture(editor.container, function(){}, editor.textInput.onContextMenuClose);
                e.stop();
            }
        }
        return;
    }

    var editor = e.editor;
    var selection = editor.selection;
    var isMultiSelect = editor.inMultiSelectMode;
    var pos = e.getDocumentPosition();
    var cursor = selection.getCursor();
    var inSelection = e.inSelection() || (selection.isEmpty() && isSamePoint(pos, cursor));


    var mouseX = e.x, mouseY = e.y;
    var onMouseSelection = function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };

    var blockSelect = function() {
        var newCursor = editor.renderer.pixelToScreenCoordinates(mouseX, mouseY);
        var cursor = session.screenToDocumentPosition(newCursor.row, newCursor.column);

        if (isSamePoint(screenCursor, newCursor)
            && isSamePoint(cursor, selection.selectionLead))
            return;
        screenCursor = newCursor;

        editor.selection.moveCursorToPosition(cursor);
        editor.selection.clearSelection();
        editor.renderer.scrollCursorIntoView();

        editor.removeSelectionMarkers(rectSel);
        rectSel = selection.rectangularRangeBlock(screenCursor, screenAnchor);
        rectSel.forEach(editor.addSelectionMarker, editor);
        editor.updateSelectionMarkers();
    };
    
    var session = editor.session;
    var screenAnchor = editor.renderer.pixelToScreenCoordinates(mouseX, mouseY);
    var screenCursor = screenAnchor;

    

    if (ctrl && !shift && !alt && button == 0) {
        if (!isMultiSelect && inSelection)
            return; // dragging

        if (!isMultiSelect) {
            var range = selection.toOrientedRange();
            editor.addSelectionMarker(range);
        }

        var oldRange = selection.rangeList.rangeAtPoint(pos);

        event.capture(editor.container, function(){}, function() {
            var tmpSel = selection.toOrientedRange();

            if (oldRange && tmpSel.isEmpty() && isSamePoint(oldRange.cursor, tmpSel.cursor))
                selection.substractPoint(tmpSel.cursor);
            else {
                if (range) {
                    editor.removeSelectionMarker(range);
                    selection.addRange(range);
                }
                selection.addRange(tmpSel);
            }
        });

    } else if (!shift && alt && button == 0) {
        e.stop();

        if (isMultiSelect && !ctrl)
            selection.toSingleRange();
        else if (!isMultiSelect && ctrl)
            selection.addRange();

        selection.moveCursorToPosition(pos);
        selection.clearSelection();

        var rectSel = [];

        var onMouseSelectionEnd = function(e) {
            clearInterval(timerId);
            editor.removeSelectionMarkers(rectSel);
            for (var i = 0; i < rectSel.length; i++)
                selection.addRange(rectSel[i]);
        };

        var onSelectionInterval = blockSelect;

        event.capture(editor.container, onMouseSelection, onMouseSelectionEnd);
        var timerId = setInterval(function() {onSelectionInterval();}, 20);

        return e.preventDefault();
    }
}


exports.onMouseDown = onMouseDown;

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
 *      Harutyun Amirjanyan <amirjanyan AT gmail DOT com>
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

ace.define('ace/commands/multi_select_commands', ['require', 'exports', 'module' , 'ace/keyboard/hash_handler'], function(require, exports, module) {

// commands to enter multiselect mode
exports.defaultCommands = [{
    name: "addCursorAbove",
    exec: function(editor) { editor.selectMoreLines(-1); },
    bindKey: {win: "Ctrl-Alt-Up", mac: "Ctrl-Alt-Up"},
    readonly: true
}, {
    name: "addCursorBelow",
    exec: function(editor) { editor.selectMoreLines(1); },
    bindKey: {win: "Ctrl-Alt-Down", mac: "Ctrl-Alt-Down"},
    readonly: true
}, {
    name: "addCursorAboveSkipCurrent",
    exec: function(editor) { editor.selectMoreLines(-1, true); },
    bindKey: {win: "Ctrl-Alt-Shift-Up", mac: "Ctrl-Alt-Shift-Up"},
    readonly: true
}, {
    name: "addCursorBelowSkipCurrent",
    exec: function(editor) { editor.selectMoreLines(1, true); },
    bindKey: {win: "Ctrl-Alt-Shift-Down", mac: "Ctrl-Alt-Shift-Down"},
    readonly: true
}, {
    name: "selectMoreBefore",
    exec: function(editor) { editor.selectMore(-1); },
    bindKey: {win: "Ctrl-Alt-Left", mac: "Ctrl-Alt-Left"},
    readonly: true
}, {
    name: "selectMoreAfter",
    exec: function(editor) { editor.selectMore(1); },
    bindKey: {win: "Ctrl-Alt-Right", mac: "Ctrl-Alt-Right"},
    readonly: true
}, {
    name: "selectNextBefore",
    exec: function(editor) { editor.selectMore(-1, true); },
    bindKey: {win: "Ctrl-Alt-Shift-Left", mac: "Ctrl-Alt-Shift-Left"},
    readonly: true
}, {
    name: "selectNextAfter",
    exec: function(editor) { editor.selectMore(1, true); },
    bindKey: {win: "Ctrl-Alt-Shift-Right", mac: "Ctrl-Alt-Shift-Right"},
    readonly: true
},  {
    name: "splitIntoLines",
    exec: function(editor) { editor.multiSelect.splitIntoLines(); },
    bindKey: {win: "Ctrl-Shift-L", mac: "Ctrl-Shift-L"},
    readonly: true
}, {
    name: "singleSelection",
    bindKey: "esc",
    exec: function(editor) { editor.exitMultiSelectMode(); },
    readonly: true,
    isAvailable: function(editor) {return editor.inMultiSelectMode}
}];

// commands active in multiselect mode
exports.multiEditCommands = {"singleSelection": "esc"};

var HashHandler = require("../keyboard/hash_handler").HashHandler;
exports.keyboardHandler = new HashHandler(exports.multiEditCommands);

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

ace.define('ace/worker/worker_client', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/lib/event_emitter', 'ace/config'], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var EventEmitter = require("../lib/event_emitter").EventEmitter;
var config = require("../config");

var WorkerClient = function(topLevelNamespaces, packagedJs, mod, classname) {

    this.changeListener = this.changeListener.bind(this);

    if (config.get("packaged")) {
        this.$worker = new Worker(config.get("workerPath") + "/" + packagedJs);
    }
    else {
        var workerUrl;
        if (typeof require.supports !== "undefined" && require.supports.indexOf("ucjs2-pinf-0") >= 0) {
            // We are running in the sourcemint loader.
            workerUrl = require.nameToUrl("ace/worker/worker_sourcemint");
        } else {
            // We are running in RequireJS.
            workerUrl = this.$normalizePath(require.nameToUrl("ace/worker/worker", null, "_"));
        }
        this.$worker = new Worker(workerUrl);

        var tlns = {};
        for (var i=0; i<topLevelNamespaces.length; i++) {
            var ns = topLevelNamespaces[i];
            var path = this.$normalizePath(require.nameToUrl(ns, null, "_").replace(/.js$/, ""));

            tlns[ns] = path;
        }
    }

    this.$worker.postMessage({
        init : true,
        tlns: tlns,
        module: mod,
        classname: classname
    });

    this.callbackId = 1;
    this.callbacks = {};

    var _self = this;
    this.$worker.onerror = function(e) {
        window.console && console.log && console.log(e);
        throw e;
    };
    this.$worker.onmessage = function(e) {
        var msg = e.data;
        switch(msg.type) {
            case "log":
                window.console && console.log && console.log(msg.data);
                break;

            case "event":
                _self._emit(msg.name, {data: msg.data});
                break;

            case "call":
                var callback = _self.callbacks[msg.id];
                if (callback) {
                    callback(msg.data);
                    delete _self.callbacks[msg.id];
                }
                break;
        }
    };
};

(function(){

    oop.implement(this, EventEmitter);

    this.$normalizePath = function(path) {
        path = path.replace(/^[a-z]+:\/\/[^\/]+/, ""); // Remove domain name and rebuild it
        path = location.protocol + "//" + location.host
            // paths starting with a slash are relative to the root (host)
            + (path.charAt(0) == "/" ? "" : location.pathname.replace(/\/[^\/]*$/, ""))
            + "/" + path.replace(/^[\/]+/, "");
        return path;
    };

    this.terminate = function() {
        this._emit("terminate", {});
        this.$worker.terminate();
        this.$worker = null;
        this.$doc.removeEventListener("change", this.changeListener);
        this.$doc = null;
    };

    this.send = function(cmd, args) {
        this.$worker.postMessage({command: cmd, args: args});
    };

    this.call = function(cmd, args, callback) {
        if (callback) {
            var id = this.callbackId++;
            this.callbacks[id] = callback;
            args.push(id);
        }
        this.send(cmd, args);
    };

    this.emit = function(event, data) {
        try {
            // firefox refuses to clone objects which have function properties
            // TODO: cleanup event
            this.$worker.postMessage({event: event, data: {data: data.data}});
        }
        catch(ex) {}
    };

    this.attachToDocument = function(doc) {
        if(this.$doc)
            this.terminate();

        this.$doc = doc;
        this.call("setValue", [doc.getValue()]);
        doc.on("change", this.changeListener);
    };

    this.changeListener = function(e) {
        e.range = {
            start: e.data.range.start,
            end: e.data.range.end
        };
        this.emit("change", e);
    };

}).call(WorkerClient.prototype);

exports.WorkerClient = WorkerClient;

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

ace.define('ace/keyboard/state_handler', ['require', 'exports', 'module' ], function(require, exports, module) {
"use strict";

// If you're developing a new keymapping and want to get an idea what's going
// on, then enable debugging.
var DEBUG = false;

function StateHandler(keymapping) {
    this.keymapping = this.$buildKeymappingRegex(keymapping);
}

StateHandler.prototype = {
    /*
     * Build the RegExp from the keymapping as RegExp can't stored directly
     * in the metadata JSON and as the RegExp used to match the keys/buffer
     * need to be adapted.
     */
    $buildKeymappingRegex: function(keymapping) {
        for (var state in keymapping) {
            this.$buildBindingsRegex(keymapping[state]);
        }
        return keymapping;
    },

    $buildBindingsRegex: function(bindings) {
        // Escape a given Regex string.
        bindings.forEach(function(binding) {
            if (binding.key) {
                binding.key = new RegExp('^' + binding.key + '$');
            } else if (Array.isArray(binding.regex)) {
                if (!('key' in binding))
                  binding.key = new RegExp('^' + binding.regex[1] + '$');
                binding.regex = new RegExp(binding.regex.join('') + '$');
            } else if (binding.regex) {
                binding.regex = new RegExp(binding.regex + '$');
            }
        });
    },

    $composeBuffer: function(data, hashId, key, e) {
        // Initialize the data object.
        if (data.state == null || data.buffer == null) {
            data.state = "start";
            data.buffer = "";
        }

        var keyArray = [];
        if (hashId & 1) keyArray.push("ctrl");
        if (hashId & 8) keyArray.push("command");
        if (hashId & 2) keyArray.push("option");
        if (hashId & 4) keyArray.push("shift");
        if (key)        keyArray.push(key);

        var symbolicName = keyArray.join("-");
        var bufferToUse = data.buffer + symbolicName;

        // Don't add the symbolic name to the key buffer if the alt_ key is
        // part of the symbolic name. If it starts with alt_, this means
        // that the user hit an alt keycombo and there will be a single,
        // new character detected after this event, which then will be
        // added to the buffer (e.g. alt_j will result in ∆).
        //
        // We test for 2 and not for & 2 as we only want to exclude the case where
        // the option key is pressed alone.
        if (hashId != 2) {
            data.buffer = bufferToUse;
        }

        var bufferObj = {
            bufferToUse: bufferToUse,
            symbolicName: symbolicName,
        };

        if (e) {
            bufferObj.keyIdentifier = e.keyIdentifier
        }

        return bufferObj;
    },

    $find: function(data, buffer, symbolicName, hashId, key, keyIdentifier) {
        // Holds the command to execute and the args if a command matched.
        var result = {};

        // Loop over all the bindings of the keymap until a match is found.
        this.keymapping[data.state].some(function(binding) {
            var match;

            // Check if the key matches.
            if (binding.key && !binding.key.test(symbolicName)) {
                return false;
            }

            // Check if the regex matches.
            if (binding.regex && !(match = binding.regex.exec(buffer))) {
                return false;
            }

            // Check if the match function matches.
            if (binding.match && !binding.match(buffer, hashId, key, symbolicName, keyIdentifier)) {
                return false;
            }

            // Check for disallowed matches.
            if (binding.disallowMatches) {
                for (var i = 0; i < binding.disallowMatches.length; i++) {
                    if (!!match[binding.disallowMatches[i]]) {
                        return false;
                    }
                }
            }

            // If there is a command to execute, then figure out the
            // command and the arguments.
            if (binding.exec) {
                result.command = binding.exec;

                // Build the arguments.
                if (binding.params) {
                    var value;
                    result.args = {};
                    binding.params.forEach(function(param) {
                        if (param.match != null && match != null) {
                            value = match[param.match] || param.defaultValue;
                        } else {
                            value = param.defaultValue;
                        }

                        if (param.type === 'number') {
                            value = parseInt(value);
                        }

                        result.args[param.name] = value;
                    });
                }
                data.buffer = "";
            }

            // Handle the 'then' property.
            if (binding.then) {
                data.state = binding.then;
                data.buffer = "";
            }

            // If no command is set, then execute the "null" fake command.
            if (result.command == null) {
                result.command = "null";
            }

            if (DEBUG) {
                console.log("KeyboardStateMapper#find", binding);
            }
            return true;
        });

        if (result.command) {
            return result;
        } else {
            data.buffer = "";
            return false;
        }
    },

    /*
     * This function is called by keyBinding.
     */
    handleKeyboard: function(data, hashId, key, keyCode, e) {
        // If we pressed any command key but no other key, then ignore the input.
        // Otherwise "shift-" is added to the buffer, and later on "shift-g"
        // which results in "shift-shift-g" which doesn't make sense.
        if (hashId != 0 && (key == "" || key == String.fromCharCode(0))) {
            return null;
        }

        // Compute the current value of the keyboard input buffer.
        var r = this.$composeBuffer(data, hashId, key, e);
        var buffer = r.bufferToUse;
        var symbolicName = r.symbolicName;
        var keyId = r.keyIdentifier;

        r = this.$find(data, buffer, symbolicName, hashId, key, keyId);
        if (DEBUG) {
            console.log("KeyboardStateMapper#match", buffer, symbolicName, r);
        }

        return r;
    }
}

/*
 * This is a useful matching function and therefore is defined here so that
 * users of KeyboardStateMapper can use it.
 *
 * @return boolean
 *          If no command key (Command|Option|Shift|Ctrl) is pressed, it
 *          returns true. If the only the Shift key is pressed + a character
 *          true is returned as well. Otherwise, false is returned.
 *          Summing up, the function returns true whenever the user typed
 *          a normal character on the keyboard and no shortcut.
 */
exports.matchCharacterOnly = function(buffer, hashId, key, symbolicName) {
    // If no command keys are pressed, then catch the input.
    if (hashId == 0) {
        return true;
    }
    // If only the shift key is pressed and a character key, then
    // catch that input as well.
    else if ((hashId == 4) && key.length == 1) {
        return true;
    }
    // Otherwise, we let the input got through.
    else {
        return false;
    }
};

exports.StateHandler = StateHandler;
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
 *      Zef Hemel <zef@c9.io>
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
ace.define('ace/placeholder', ['require', 'exports', 'module' , 'ace/range', 'ace/lib/event_emitter', 'ace/lib/oop'], function(require, exports, module) {
"use strict";

var Range = require('./range').Range;
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var oop = require("./lib/oop");

/**
 * class PlaceHolder
 *
 * TODO
 *
 **/

/**
 * new PlaceHolder(session, length, pos, others, mainClass, othersClass)
 * - session (Document): The document to associate with the anchor
 * - length (Number): The starting row position
 * - pos (Number): The starting column position
 * - others (String):
 * - mainClass (String):
 * - othersClass (String):
 *
 *  TODO
 *
 **/

var PlaceHolder = function(session, length, pos, others, mainClass, othersClass) {
    var _self = this;
    this.length = length;
    this.session = session;
    this.doc = session.getDocument();
    this.mainClass = mainClass;
    this.othersClass = othersClass;
    this.$onUpdate = this.onUpdate.bind(this);
    this.doc.on("change", this.$onUpdate);
    this.$others = others;
    
    this.$onCursorChange = function() {
        setTimeout(function() {
            _self.onCursorChange();
        });
    };
    
    this.$pos = pos;
    // Used for reset
    var undoStack = session.getUndoManager().$undoStack || session.getUndoManager().$undostack || {length: -1};
    this.$undoStackDepth =  undoStack.length;
    this.setup();

    session.selection.on("changeCursor", this.$onCursorChange);
};

(function() {

    oop.implement(this, EventEmitter);

    /**
     * PlaceHolder.setup()
     *
     * TODO
     *
     **/
    this.setup = function() {
        var _self = this;
        var doc = this.doc;
        var session = this.session;
        var pos = this.$pos;

        this.pos = doc.createAnchor(pos.row, pos.column);
        this.markerId = session.addMarker(new Range(pos.row, pos.column, pos.row, pos.column + this.length), this.mainClass, null, false);
        this.pos.on("change", function(event) {
            session.removeMarker(_self.markerId);
            _self.markerId = session.addMarker(new Range(event.value.row, event.value.column, event.value.row, event.value.column+_self.length), _self.mainClass, null, false);
        });
        this.others = [];
        this.$others.forEach(function(other) {
            var anchor = doc.createAnchor(other.row, other.column);
            _self.others.push(anchor);
        });
        session.setUndoSelect(false);
    };
    
    /**
     * PlaceHolder.showOtherMarkers()
     *
     * TODO
     *
     **/
    this.showOtherMarkers = function() {
        if(this.othersActive) return;
        var session = this.session;
        var _self = this;
        this.othersActive = true;
        this.others.forEach(function(anchor) {
            anchor.markerId = session.addMarker(new Range(anchor.row, anchor.column, anchor.row, anchor.column+_self.length), _self.othersClass, null, false);
            anchor.on("change", function(event) {
                session.removeMarker(anchor.markerId);
                anchor.markerId = session.addMarker(new Range(event.value.row, event.value.column, event.value.row, event.value.column+_self.length), _self.othersClass, null, false);
            });
        });
    };
    
    /**
     * PlaceHolder.hideOtherMarkers()
     *
     * Hides all over markers in the [[EditSession `EditSession`]] that are not the currently selected one.
     *
     **/
    this.hideOtherMarkers = function() {
        if(!this.othersActive) return;
        this.othersActive = false;
        for (var i = 0; i < this.others.length; i++) {
            this.session.removeMarker(this.others[i].markerId);
        }
    };

    /**
     * PlaceHolder@onUpdate(e)
     * 
     * Emitted when the place holder updates.
     *
     **/
    this.onUpdate = function(event) {
        var delta = event.data;
        var range = delta.range;
        if(range.start.row !== range.end.row) return;
        if(range.start.row !== this.pos.row) return;
        if (this.$updating) return;
        this.$updating = true;
        var lengthDiff = delta.action === "insertText" ? range.end.column - range.start.column : range.start.column - range.end.column;
        
        if(range.start.column >= this.pos.column && range.start.column <= this.pos.column + this.length + 1) {
            var distanceFromStart = range.start.column - this.pos.column;
            this.length += lengthDiff;
            if(!this.session.$fromUndo) {
                if(delta.action === "insertText") {
                    for (var i = this.others.length - 1; i >= 0; i--) {
                        var otherPos = this.others[i];
                        var newPos = {row: otherPos.row, column: otherPos.column + distanceFromStart};
                        if(otherPos.row === range.start.row && range.start.column < otherPos.column)
                            newPos.column += lengthDiff;
                        this.doc.insert(newPos, delta.text);
                    }
                } else if(delta.action === "removeText") {
                    for (var i = this.others.length - 1; i >= 0; i--) {
                        var otherPos = this.others[i];
                        var newPos = {row: otherPos.row, column: otherPos.column + distanceFromStart};
                        if(otherPos.row === range.start.row && range.start.column < otherPos.column)
                            newPos.column += lengthDiff;
                        this.doc.remove(new Range(newPos.row, newPos.column, newPos.row, newPos.column - lengthDiff));
                    }
                }
                // Special case: insert in beginning
                if(range.start.column === this.pos.column && delta.action === "insertText") {
                    setTimeout(function() {
                        this.pos.setPosition(this.pos.row, this.pos.column - lengthDiff);
                        for (var i = 0; i < this.others.length; i++) {
                            var other = this.others[i];
                            var newPos = {row: other.row, column: other.column - lengthDiff};
                            if(other.row === range.start.row && range.start.column < other.column)
                                newPos.column += lengthDiff;
                            other.setPosition(newPos.row, newPos.column);
                        }
                    }.bind(this), 0);
                }
                else if(range.start.column === this.pos.column && delta.action === "removeText") {
                    setTimeout(function() {
                        for (var i = 0; i < this.others.length; i++) {
                            var other = this.others[i];
                            if(other.row === range.start.row && range.start.column < other.column) {
                                other.setPosition(other.row, other.column - lengthDiff);
                            }
                        }
                    }.bind(this), 0);
                }
            }
            this.pos._emit("change", {value: this.pos});
            for (var i = 0; i < this.others.length; i++) {
                this.others[i]._emit("change", {value: this.others[i]});
            }
        }
        this.$updating = false;
    };
    
    /**
     * PlaceHolder@onCursorChange(e)
     * 
     * Emitted when the cursor changes.
     *
     **/

    this.onCursorChange = function(event) {
        if (this.$updating) return;
        var pos = this.session.selection.getCursor();
        if(pos.row === this.pos.row && pos.column >= this.pos.column && pos.column <= this.pos.column + this.length) {
            this.showOtherMarkers();
            this._emit("cursorEnter", event);
        } else {
            this.hideOtherMarkers();
            this._emit("cursorLeave", event);
        }
    };
    
    /**
     * PlaceHolder.detach()
     * 
     * TODO
     *
     **/    
    this.detach = function() {
        this.session.removeMarker(this.markerId);
        this.hideOtherMarkers();
        this.doc.removeEventListener("change", this.$onUpdate);
        this.session.selection.removeEventListener("changeCursor", this.$onCursorChange);
        this.pos.detach();
        for (var i = 0; i < this.others.length; i++) {
            this.others[i].detach();
        }
        this.session.setUndoSelect(true);
    };
    
    /**
     * PlaceHolder.cancel()
     * 
     * TODO
     *
     **/
    this.cancel = function() {
        if(this.$undoStackDepth === -1)
            throw Error("Canceling placeholders only supported with undo manager attached to session.");
        var undoManager = this.session.getUndoManager();
        var undosRequired = (undoManager.$undoStack || undoManager.$undostack).length - this.$undoStackDepth;
        for (var i = 0; i < undosRequired; i++) {
            undoManager.undo(true);
        }
    };
}).call(PlaceHolder.prototype);


exports.PlaceHolder = PlaceHolder;
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

ace.define('ace/theme/textmate', ['require', 'exports', 'module' , 'ace/lib/dom'], function(require, exports, module) {
"use strict";

exports.isDark = false;
exports.cssClass = "ace-tm";
exports.cssText = ".ace-tm .ace_editor {\
  border: 2px solid rgb(159, 159, 159);\
}\
\
.ace-tm .ace_editor.ace_focus {\
  border: 2px solid #327fbd;\
}\
\
.ace-tm .ace_gutter {\
  background: #e8e8e8;\
  color: #333;\
}\
\
.ace-tm .ace_print_margin {\
  width: 1px;\
  background: #e8e8e8;\
}\
\
.ace-tm .ace_fold {\
    background-color: #6B72E6;\
}\
\
.ace-tm .ace_text-layer {\
  cursor: text;\
}\
\
.ace-tm .ace_cursor {\
  border-left: 2px solid black;\
}\
\
.ace-tm .ace_cursor.ace_overwrite {\
  border-left: 0px;\
  border-bottom: 1px solid black;\
}\
        \
.ace-tm .ace_line .ace_invisible {\
  color: rgb(191, 191, 191);\
}\
\
.ace-tm .ace_line .ace_storage,\
.ace-tm .ace_line .ace_keyword {\
  color: blue;\
}\
\
.ace-tm .ace_line .ace_constant {\
  color: rgb(197, 6, 11);\
}\
\
.ace-tm .ace_line .ace_constant.ace_buildin {\
  color: rgb(88, 72, 246);\
}\
\
.ace-tm .ace_line .ace_constant.ace_language {\
  color: rgb(88, 92, 246);\
}\
\
.ace-tm .ace_line .ace_constant.ace_library {\
  color: rgb(6, 150, 14);\
}\
\
.ace-tm .ace_line .ace_invalid {\
  background-color: rgba(255, 0, 0, 0.1);\
  color: red;\
}\
\
.ace-tm .ace_line .ace_support.ace_function {\
  color: rgb(60, 76, 114);\
}\
\
.ace-tm .ace_line .ace_support.ace_constant {\
  color: rgb(6, 150, 14);\
}\
\
.ace-tm .ace_line .ace_support.ace_type,\
.ace-tm .ace_line .ace_support.ace_class {\
  color: rgb(109, 121, 222);\
}\
\
.ace-tm .ace_line .ace_keyword.ace_operator {\
  color: rgb(104, 118, 135);\
}\
\
.ace-tm .ace_line .ace_string {\
  color: rgb(3, 106, 7);\
}\
\
.ace-tm .ace_line .ace_comment {\
  color: rgb(76, 136, 107);\
}\
\
.ace-tm .ace_line .ace_comment.ace_doc {\
  color: rgb(0, 102, 255);\
}\
\
.ace-tm .ace_line .ace_comment.ace_doc.ace_tag {\
  color: rgb(128, 159, 191);\
}\
\
.ace-tm .ace_line .ace_constant.ace_numeric {\
  color: rgb(0, 0, 205);\
}\
\
.ace-tm .ace_line .ace_variable {\
  color: rgb(49, 132, 149);\
}\
\
.ace-tm .ace_line .ace_xml_pe {\
  color: rgb(104, 104, 91);\
}\
\
.ace-tm .ace_entity.ace_name.ace_function {\
  color: #0000A2;\
}\
\
.ace-tm .ace_markup.ace_markupine {\
    text-decoration:underline;\
}\
\
.ace-tm .ace_markup.ace_heading {\
  color: rgb(12, 7, 255);\
}\
\
.ace-tm .ace_markup.ace_list {\
  color:rgb(185, 6, 144);\
}\
\
.ace-tm .ace_marker-layer .ace_selection {\
  background: rgb(181, 213, 255);\
}\
.ace-tm.multiselect .ace_selection.start {\
  box-shadow: 0 0 3px 0px white;\
  border-radius: 2px;\
}\
.ace-tm .ace_marker-layer .ace_step {\
  background: rgb(252, 255, 0);\
}\
\
.ace-tm .ace_marker-layer .ace_stack {\
  background: rgb(164, 229, 101);\
}\
\
.ace-tm .ace_marker-layer .ace_bracket {\
  margin: -1px 0 0 -1px;\
  border: 1px solid rgb(192, 192, 192);\
}\
\
.ace-tm .ace_marker-layer .ace_active_line {\
  background: rgba(0, 0, 0, 0.07);\
}\
.ace-tm .ace_gutter_active_line{\
    background-color : #dcdcdc;\
}\
\
.ace-tm .ace_marker-layer .ace_selected_word {\
  background: rgb(250, 250, 255);\
  border: 1px solid rgb(200, 200, 250);\
}\
\
.ace-tm .ace_meta.ace_tag {\
  color:rgb(28, 2, 255);\
}\
\
.ace-tm .ace_string.ace_regex {\
  color: rgb(255, 0, 0)\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
;
            (function() {
                ace.require(["ace/ace"], function(a) {
                    if (!window.ace)
                        window.ace = {};
                    for (var key in a) if (a.hasOwnProperty(key))
                        ace[key] = a[key];
                });
            })();
        