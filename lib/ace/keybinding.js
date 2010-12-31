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
 * Ajax.org Services B.V.
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

define(function(require, exports, module) {

var useragent = require("pilot/useragent");
var keyUtil  = require("pilot/keys");
var event = require("pilot/event");
var settings  = require("pilot/settings").settings;
var default_mac = require("ace/conf/keybindings/default_mac").bindings;
var default_win = require("ace/conf/keybindings/default_win").bindings;
var canon = require("pilot/canon");
require("ace/commands/default_commands");

var inputModes = {
    vim:    require("ace/mode/vim"),
    emacs:  require("ace/mode/emacs")
};

var KeyBinding = function(editor, config) {
    this.$editor = editor;
    this.$data = { };
    this.setConfig(config);

    // PROBLEM: When this file is loaded via require.js, the types are already
    // declaired, BUT the startup() function is not called in pilot/types/basic.
    // Therefore the settings are not declaired. As a workaround, the setting
    // is declaired when the KeyBinding is created.
    var InputModeSetting = {
        name: "inputMode",
        description: "Which input mode do you want to use?",
        type: "text",
        defaultValue: "standard"
    };

    this.$inputMode = null;
    settings.addSetting(InputModeSetting);

    settings.getSetting("inputMode").addEventListener("change", function(e) {
        this.$inputMode = inputModes[e.value];
        this.$data = { };
    }.bind(this));
};

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
        this.config = config || (useragent.isMac
            ? default_mac
            : default_win);
        if (typeof this.config.reverse == "undefined")
            this.config.reverse = objectReverse.call(this, this.config, "|");
    };


    this.onCommandKey = function(e, hashId, keyCode) {
        key = (keyUtil[keyCode] ||
                String.fromCharCode(keyCode)).toLowerCase();

        var toExecute;
        if (this.$inputMode) {
            toExecute =
                this.$inputMode.handleKeyboard(this.$data, hashId, key, e);
        }

        // If there is nothing to execute yet, then use the default keymapping.
        if (!toExecute) {
            toExecute = {
                command: (this.config.reverse[hashId] || {})[key]
            };
        }

        // If there is something to execute, then go for it.
        if (toExecute) {
            var success = canon.exec(toExecute.command,
                                        {editor: this.$editor}, toExecute.args);
            if (success) {
                return event.stopEvent(e);
            }
        }
    };

    this.onTextInput = function(text) {
        if (this.$inputMode) {
            var toExecute =
                this.$inputMode.handleKeyboard(this.$data, 0, text, {});
            var success = canon.exec(toExecute.command,
                            {editor: this.$editor}, toExecute.args);
            if (success) {
                return;
            }
        }
        this.$editor.insert(text);
    }

}).call(KeyBinding.prototype);

exports.KeyBinding = KeyBinding;
});
