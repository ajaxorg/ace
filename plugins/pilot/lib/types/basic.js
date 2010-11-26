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
var Type = types.Type;
var Conversion = types.Conversion;

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

text.toString = function(value) {
    return value;
};

text.fromString = function(value) {
    if (typeof value != 'string') {
        throw new Error('non-string passed to text.fromString()');
    }
    return new Conversion(value);
};

text.name = 'text';

/**
 * We don't currently plan to distinguish between integers and floats
 */
var number = new Type();

number.toString = function(value) {
    if (!value) {
        return null;
    }
    return '' + value;
};

number.fromString = function(value) {
    if (typeof value != 'string') {
        throw new Error('non-string passed to number.fromString()');
    }

    var reply = new Conversion(parseInt(value, 10));
    if (isNaN(reply.value)) {
        reply.status = Status.INVALID;
        reply.message = 'Can\'t convert "' + value + '" to a number.';
    }

    return reply;
};

number.name = 'number';

/**
 * One of a known set of options
 */
function SelectionType(data) {
    this._data = data;
};

SelectionType.prototype = new Type();

SelectionType.prototype.toString = function(value) {
    return value;
};

SelectionType.prototype.fromString = function(value) {
    if (typeof value != 'string') {
        throw new Error('non-string passed to fromString()');
    }
    if (!this._data) {
        throw new Error('Missing data on selection type extension.');
    }
    var data = (typeof(this._data) === "function") ? this._data() : this._data;

    var match = false;
    var completions = [];
    data.forEach(function(option) {
        if (value == option) {
            match = true;
        }
        else if (option.indexOf(value) === 0) {
            completions.push(option);
        }
    });

    if (match) {
        return new Conversion(value);
    }
    else {
        var status = completions.length > 0 ? Status.INCOMPLETE : Status.INVALID;

        // TODO: better error message - include options?
        // TODO: better completions - we're just using the extensions
        return new Conversion(null,
                status,
                'Can\'t convert "' + value + '" to a selection.',
                completions);
    }
};

SelectionType.prototype.name = 'selection';


/**
 * true/false values
 */
var bool = new SelectionType([ 'true', 'false' ]);

bool.toString = function(value) {
    return '' + value;
};

bool.fromString = function(value) {
    var conversion = SelectionType.prototype.fromString(value);

    if (conversion.value === 'true') {
        conversion.value = true;
    }
    if (conversion.value === 'false') {
        conversion.value = false;
    }

    return conversion;
};

bool.name = 'bool';

/**
 * Registration and de-registration.
 */
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
