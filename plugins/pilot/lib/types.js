// TODO this file can likely be deleted. The useful functionality has moved to
// index.js


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
define(function(require, exports, module) {

/**
 * Most of our types are 'static' e.g. there is only one type of 'text', however
 * some types like 'selection' and 'deferred' are customizable. The basic
 * Type type isn't useful, but does provide documentation about what types do.
 * 
 */
function Type() {
};

Type.prototype = {
    /**
     * Is the passed <tt>value</tt> an acceptable instance of this type?
     * @return true|false to indicate the validity of <tt>value</tt>
     */
    isValid: function(value) { throw new Error("not implemented"); },

    /**
     * Convert the given <tt>value</tt> to a string representation.
     * Where possible, there should be round-tripping between values and their
     * string representations.
     */
    toString: function(value) { throw new Error("not implemented"); },

    /**
     * Convert the given <tt>str</tt> to an instance of this type.
     * Where possible, there should be round-tripping between values and their
     * string representations.
     */
    fromString: function(str) { throw new Error("not implemented"); },

    /**
     * The plug-in system, and other things need to know what this type is
     * called. This is called <tt>simpleName</tt> because this name alone is not
     * enough to specify a type. Types like 'selection' and 'deferred' need
     * extra data, however this function returns only the name, not the extra
     * data.
     */
    name: "unknown",

    // Methods from the original type system that we might need, but not now.

    /**
     * All types have a JSON representation used in command parameter
     * declarations and settings. This allows access to that representation as
     * an object rather than as a string
     */
    /*
    getTypeSpec: function() { },
    */

    /**
     * 2 typeSpecs are considered equal if their simple names are the same.
     */
    /*
    equals: function(that) { }
    */
};

exports.Type = Type;

/**
 * Private registry of types
 * Invariant: types[name] = type.name
 */
var types = {};

/**
 * Add a new type to the list available to the system
 */
exports.registerType = function(type) {
    types[type.name] = type;
}

/**
 * Remove a type from the list available to the system
 */
exports.deregisterType = function(type) {
    delete types[type.name];
}

/**
 * Find a type, previously registered using #registerType()
 */
exports.getType = function(typeSpec) {
    var type;
    if (typeof typeSpec === 'string') {
        type = types[typeSpec];
    }

    if (typeof typeSpec == 'object') {
        if (!typeSpec.name) {
            throw new Error('Missing \'name\' member to typeSpec');
        }

        type = types[typeSpec.name];
    }

    if (type instanceof Type) {
        return type;
    }

    if (typeof type === 'function') {
        return type(typeSpec);
    }
}

});
