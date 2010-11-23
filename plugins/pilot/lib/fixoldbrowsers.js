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

define(function(require, exports, module) {

exports.startup = function(data, reason) {
    // Narwhal's shim for ES5 defineProperty
    // ES5 15.2.3.6
    if (!Object.defineProperty) {
        Object.defineProperty = function(object, property, descriptor) {
            var has = Object.prototype.hasOwnProperty;
            if (typeof descriptor == "object" && object.__defineGetter__) {
                if (has.call(descriptor, "value")) {
                    if (!object.__lookupGetter__(property) && !object.__lookupSetter__(property)) {
                        // data property defined and no pre-existing accessors
                        object[property] = descriptor.value;
                    }
                    if (has.call(descriptor, "get") || has.call(descriptor, "set")) {
                        // descriptor has a value property but accessor already exists
                        throw new TypeError("Object doesn't support this action");
                    }
                }
                // fail silently if "writable", "enumerable", or "configurable"
                // are requested but not supported
                /*
                // alternate approach:
                if ( // can't implement these features; allow false but not true
                !(has.call(descriptor, "writable") ? descriptor.writable : true) ||
                !(has.call(descriptor, "enumerable") ? descriptor.enumerable : true) ||
                !(has.call(descriptor, "configurable") ? descriptor.configurable : true)
                )
                throw new RangeError(
                "This implementation of Object.defineProperty does not " +
                "support configurable, enumerable, or writable."
                );
                */
                else if (typeof descriptor.get == "function") {
                    object.__defineGetter__(property, descriptor.get);
                }
                if (typeof descriptor.set == "function") {
                    object.__defineSetter__(property, descriptor.set);
                }
            }
            return object;
        };
    }

    // ES5 15.2.3.7
    if (!Object.defineProperties) {
        Object.defineProperties = function(object, properties) {
            for (var property in properties) {
                if (Object.prototype.hasOwnProperty.call(properties, property)) {
                    Object.defineProperty(object, property, properties[property]);
                }
            }
            return object;
        };
    }



    /**
     * Array detector.
     * Firefox 3.5 and Safari 4 have this already. Chrome 4 however ...
     * Note to Dojo - your isArray is still broken: instanceof doesn't work with
     * Arrays taken from a different frame/window.
     */
    if (!Array.isArray) {
        Array.isArray = function(data) {
            return data && Object.prototype.toString.call(data) === "[object Array]";
        };
    }

    /**
     * Retrieves the list of keys on an object.
     */
    if (!Object.keys) {
        Object.keys = function(obj) {
            var k, ret = [];
            for (k in obj) {
                if (obj.hasOwnProperty(k)) {
                    ret.push(k);
                }
            }
            return ret;
        };
    }

    if (!Function.prototype.bind) {
        // From Narwhal
        Function.prototype.bind = function () {
            var args = Array.prototype.slice.call(arguments);
            var self = this;
            var bound = function () {
                return self.call.apply(
                    self,
                    args.concat(
                        Array.prototype.slice.call(arguments)
                    )
                );
            };
            bound.name = this.name;
            bound.displayName = this.displayName;
            bound.length = this.length;
            bound.unbound = self;
            return bound;
        };
    }

    exports.globalsLoaded = true;
};

});