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


var useragent = require('pilot/useragent');
var event = require('pilot/event');
var typecheck = require('pilot/typecheck');
var canon = require('cockpit/canon');

var keyUtil  = require('ace/keys');
var settings  = require('ace/settings').settings;
var Requisition = require('cockpit/index').Requisition;

var KeyBinding = function(editor) {
    this.$editor = editor;
    this.$data = { };
    this.$keyboardHandler = null;

    // TODO: This is WRONG: we should be taking the env passed in to setup
    this.$env = { editor: this.$editor };
    this.$requisition = new Requisition(this.$env);
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
            if (hashId != 0 || keyCode != 0) {
                toExecute = {
                    command: findKeyCommand(hashId, keyOrText)
                };
            } else {
                toExecute = {
                    command: "inserttext",
                    args: { text: keyOrText }
                };
            }
        }

        if (toExecute) {
            // TODO: use requisition to execute the command rather than canon
            // do we store a requ, if so where?
            var success;
            if (typeof toExecute.command === "string" && toExecute.args == null) {
                this.$requisition.update({ typed: toExecute.command });
                success = this.$requisition.exec();
            }
            else {
                success = canon.exec(toExecute.command, this.$env, toExecute.args);
            }

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
* A lookup has for command key bindings.
*/
var commmandKeyBinding = { };

function findKeyCommand(hashId, textOrKey) {
    // Convert keyCode to the string representation.
    if (typecheck.isNumber(textOrKey)) {
        textOrKey = keyUtil.keyCodeToString(textOrKey);
    }

    return commmandKeyBinding[hashId] && commmandKeyBinding[hashId][textOrKey];
}

function splitSafe(s, separator, limit, bLowerCase) {
    return (bLowerCase && s.toLowerCase() || s)
        .replace(/(?:^\s+|\n|\s+$)/g, "")
        .split(new RegExp("[\\s ]*" + separator + "[\\s ]*", "g"), limit || 999);
}

var platform = useragent.isMac ? "mac" : "win";

function bindCommand(bindKey, value) {

    if (!bindKey.mac && bindKey.mac !== null) {
        throw new Error('All key bindings must have a mac key binding');
    }
    if (!bindKey.win && bindKey.win !== null) {
        throw new Error('All key bindings must have a windows key binding');
    }
    if (!bindKey[platform]) {
        // No key mapping for this platform.
        return;
    }

    bindKey[platform].split("|").forEach(function(keys) {
        var key;
        var hashId = 0;

        var parts = splitSafe(keys, "\\-", null, true);
        parts.forEach(function(part) {
            if (keyUtil.KEY_MODS[part])
                hashId = hashId | keyUtil.KEY_MODS[part];
            else
                key = part || "-"; // when empty, the splitSafe removed a '-'
        });

        if (commmandKeyBinding[hashId] == null) {
            commmandKeyBinding[hashId] = {};
        }
        commmandKeyBinding[hashId][key] = value;
    });
}

exports.bindCommand = bindCommand;


});
