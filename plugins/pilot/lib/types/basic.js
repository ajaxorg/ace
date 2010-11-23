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

define(function(require, exports, module) {

var types = require("pilot/types");

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
var text = new types.Type();

text.isValid = function(value) {
    return typeof value == 'string';
};

text.toString = function(value) {
    return value;
};

text.fromString = function(value) {
    return value;
};

text.name = 'text';

/**
 * We don't currently plan to distinguish between integers and floats
 */
var number = new types.Type();

number.isValid = function(value) {
    if (isNaN(value)) {
        return false;
    }
    if (value === null) {
        return false;
    }
    if (value === undefined) {
        return false;
    }
    if (value === Infinity) {
        return false;
    }
    return typeof value == 'number';// && !isNaN(value);
};

number.toString = function(value) {
    if (!value) {
        return null;
    }
    return '' + value;
};

number.fromString = function(value) {
    if (!value) {
        return null;
    }
    var reply = parseInt(value, 10);
    if (isNaN(reply)) {
        throw new Error('Can\'t convert "' + value + '" to a number.');
    }
    return reply;
};

number.name = 'number';

/**
 * true/false values
 */
var bool = new types.Type();

bool.isValid = function(value) {
    return typeof value == 'boolean';
};

bool.toString = function(value) {
    return '' + value;
};

bool.fromString = function(value) {
    if (value === null) {
        return null;
    }

    if (!value.toLowerCase) {
        return !!value;
    }

    var lower = value.toLowerCase();
    if (lower == 'true') {
        return true;
    } else if (lower == 'false') {
        return false;
    }

    return !!value;
};

bool.name = 'bool';

/**
 * One of a known set of options
 */
function SelectionType(data) {
    this._data = data;
};

SelectionType.prototype = new types.Type();

SelectionType.prototype.isValid = function(value) {
    if (typeof value != 'string') {
        return false;
    }

    if (!this._data) {
        console.error('Missing data on selection type extension. Skipping');
        return true;
    }

    var data = (typeof(this._data) === "function") ? this._data() : this._data;

    var match = false;
    data.forEach(function(option) {
        if (value == option) {
            match = true;
        }
    });

    return match;
};

SelectionType.prototype.toString = function(value) {
    return value;
};

SelectionType.prototype.fromString = function(value) {
    // TODO: should we validate and return null if invalid?
    return value;
};

SelectionType.prototype.name = 'selection';


exports.startup = function() {
    types.registerType(text);
    types.registerType(number);
    types.registerType(bool);
    types.registerType(SelectionType);
};

exports.shutdown = function() {
    types.unregisterType(text);
    types.unregisterType(number);
    types.unregisterType(bool);
    types.unregisterType(SelectionType);
};

});
