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

define(function(require, exports, module) {

var useragent = require("pilot/useragent");
var event = require("pilot/event");
var canon = require("cockpit/canon");

var keyUtil  = require("ace/keys");
var settings  = require("ace/settings").settings;
require("ace/commands/default_commands");

var KeyBinding = function(editor) {
    this.$editor = editor;
    this.$data = { };
    this.$keyboardHandler = null;
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
        var env = {editor: this.$editor},
            toExecute;

        if (this.$keyboardHandler) {
            toExecute =
                this.$keyboardHandler.handleKeyboard(this.$data, hashId, keyOrText, keyCode, e);
        }

        // If there is nothing to execute yet, then use the default keymapping.
        if (!toExecute || !toExecute.command) {
            if (hashId != 0 || keyCode != 0) {
                toExecute = {
                    command: canon.findKeyCommand(env, "editor", hashId, keyOrText)
                };
            } else {
                toExecute = {
                    command: "inserttext",
                    args: {
                        text: keyOrText
                    }
                };
            }
        }

        if (toExecute) {
            var success = canon.exec(toExecute.command,
                                        env, "editor", toExecute.args);
            if (success) {
                return event.stopEvent(e);
            }
        }
    };

    this.onCommandKey = function(e, hashId, keyCode) {
        var keyString = keyUtil.keyCodeToString(keyCode);
        this.$callKeyboardHandler(e, hashId, keyString, keyCode);
    };

    this.onTextInput = function(text) {
        this.$callKeyboardHandler({}, 0, text, 0);
    };

}).call(KeyBinding.prototype);

exports.KeyBinding = KeyBinding;


/**
* A lookup has for command key bindings that use a string as sender.
*/
var commmandKeyBinding = {};

/**
* Array with command key bindings that use a function to determine the sender.
*/
var commandKeyBindingFunc = { };

function splitSafe(s, separator, limit, bLowerCase) {
    return (bLowerCase && s.toLowerCase() || s)
        .replace(/(?:^\s+|\n|\s+$)/g, "")
        .split(new RegExp("[\\s ]*" + separator + "[\\s ]*", "g"), limit || 999);
}

function parseKeys(keys, val, ret) {
    var key,
        hashId = 0,
        parts = splitSafe(keys, "\\-", null, true),
        i = 0,
        l = parts.length;

    for (; i < l; ++i) {
        if (keyUtil.KEY_MODS[parts[i]])
            hashId = hashId | keyUtil.KEY_MODS[parts[i]];
        else
            key = parts[i] || "-"; //when empty, the splitSafe removed a '-'
    }

    if (ret == null) {
        return {
            key: key,
            hashId: hashId
        };
    } else {
        (ret[hashId] || (ret[hashId] = {}))[key] = val;
    }
}

var platform = useragent.isMac ? "mac" : "win";
function buildKeyHash(command) {
    var binding = command.bindKey,
        key = binding[platform],
        ckb = commmandKeyBinding,
        ckbf = commandKeyBindingFunc;

    if (!binding.sender) {
        throw new Error('All key bindings must have a sender');
    }
    if (!binding.mac && binding.mac !== null) {
        throw new Error('All key bindings must have a mac key binding');
    }
    if (!binding.win && binding.win !== null) {
        throw new Error('All key bindings must have a windows key binding');
    }
    if(!binding[platform]) {
        // No key mapping for this platform.
        return;
    }
    if (typeof binding.sender == 'string') {
        var targets = splitSafe(binding.sender, "\\|", null, true);
        targets.forEach(function(target) {
            if (!ckb[target]) {
                ckb[target] = { };
            }
            key.split("|").forEach(function(keyPart) {
                parseKeys(keyPart, command, ckb[target]);
            });
        });
    } else if (typecheck.isFunction(binding.sender)) {
        var val = {
            command: command,
            sender: binding.sender
        };

        keyData = parseKeys(key);
        if (!ckbf[keyData.hashId]) {
            ckbf[keyData.hashId] = { };
        }
        if (!ckbf[keyData.hashId][keyData.key]) {
            ckbf[keyData.hashId][keyData.key] = [ val ];
        } else {
            ckbf[keyData.hashId][keyData.key].push(val);
        }
    } else {
        throw new Error('Key binding must have a sender that is a string or function');
    }
}

function findKeyCommand(env, sender, hashId, textOrKey) {
    // Convert keyCode to the string representation.
    if (typecheck.isNumber(textOrKey)) {
        textOrKey = keyUtil.keyCodeToString(textOrKey);
    }

    // Check bindings with functions as sender first.
    var bindFuncs = (commandKeyBindingFunc[hashId] || {})[textOrKey] || [];
    for (var i = 0; i < bindFuncs.length; i++) {
        if (bindFuncs[i].sender(env, sender, hashId, textOrKey)) {
            return bindFuncs[i].command;
        }
    }

    var ckbr = commmandKeyBinding[sender];
    return ckbr && ckbr[hashId] && ckbr[hashId][textOrKey];
}

exports.findKeyCommand = findKeyCommand;

function execKeyCommand(env, sender, hashId, textOrKey) {
    var command = findKeyCommand(env, sender, hashId, textOrKey);
    if (command) {
        return exec(command, env, sender, { });
    } else {
        return false;
    }
}

exports.execKeyCommand = execKeyCommand;


});
