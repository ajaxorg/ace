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
 *      Sergi Mansilla <sergi AT c9 DOT io>
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

define(function(require, exports, module) {
"use strict";

var keyUtil = require("../lib/keys");
var cmds = require("./vim/commands");
var coreCommands = cmds.coreCommands;
var util = require("./vim/maps/util");

var startCommands = {
    "i": {
        command: coreCommands.start
    },
    "I": {
        command: coreCommands.startBeginning
    },
    "a": {
        command: coreCommands.append
    },
    "A": {
        command: coreCommands.appendEnd
    },
    "ctrl-f": {
        command: "gotopagedown"
    },
    "ctrl-b": {
        command: "gotopageup"
    }
};

exports.handler = {
    handleKeyboard: function(data, hashId, key, keyCode, e) {
        // ignore command keys (shift, ctrl etc.)
        if (hashId != 0 && (key == "" || key == "\x00"))
            return null;

        if (hashId == 1)
            key = "ctrl-" + key;

        if (data.state == "start") {
            if (hashId == -1 || hashId == 1) {
                if (cmds.inputBuffer.idle && startCommands[key])
                    return startCommands[key];

                return { command: {
                    exec: function(editor) {cmds.inputBuffer.push(editor, key);}
                } };
            } // wait for input
            else if (key.length == 1 && (hashId == 0 || hashId == 4)) { //no modifier || shift
                return {command: "null", passEvent: true};
            } else if (key == "esc") {
                return {command: coreCommands.stop};
            }
        } else {
            if (key == "esc" || key == "ctrl-[") {
                data.state = "start";
                return {command: coreCommands.stop};
            } else if (key == "ctrl-w") {
                return {command: "removewordleft"};
            }
        }
    },

    attach: function(editor) {
        editor.on("click", exports.onCursorMove);
        if (util.currentMode !== "insert")
            cmds.coreCommands.stop.exec(editor);
    },

    detach: function(editor) {
        editor.removeListener("click", exports.onCursorMove);
        util.noMode(editor);
        util.currentMode = "normal";
    },

    actions: cmds.actions
};


exports.onCursorMove = function(e) {
    cmds.onCursorMove(e.editor, e);
    exports.onCursorMove.scheduled = false;
};

});
