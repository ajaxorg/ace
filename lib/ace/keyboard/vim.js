/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
"use strict";

var cmds = require("./vim/commands");
var coreCommands = cmds.coreCommands;
var util = require("./vim/maps/util");
var useragent = require("../lib/useragent");

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
	$id: "ace/keyboard/vim",
    // workaround for j not repeating with `defaults write -g ApplePressAndHoldEnabled -bool true`
    handleMacRepeat: function(data, hashId, key) {
        if (hashId == -1) {
            // record key
            data.inputChar = key;
            data.lastEvent = "input";
        } else if (data.inputChar && data.$lastHash == hashId && data.$lastKey == key) {
            // check for repeated keypress 
            if (data.lastEvent == "input") {
                data.lastEvent = "input1";
            } else if (data.lastEvent == "input1") {
                // simulate textinput
                return true;
            }
        } else {
            // reset
            data.$lastHash = hashId;
            data.$lastKey = key;
            data.lastEvent = "keypress";
        }
    },
    // on mac, with some keyboard layouts (e.g swedish) ^ starts composition, we don't need it in normal mode
    updateMacCompositionHandlers: function(editor, enable) {
        var onCompositionUpdateOverride = function(text) {
            if (util.currentMode !== "insert") {
                var el = this.textInput.getElement();
                el.blur();
                el.focus();
                el.value = text;
            } else {
                this.onCompositionUpdateOrig(text);
            }
        };
        var onCompositionStartOverride = function(text) {
            if (util.currentMode === "insert") {            
                this.onCompositionStartOrig(text);
            }
        };
        if (enable) {
            if (!editor.onCompositionUpdateOrig) {
                editor.onCompositionUpdateOrig = editor.onCompositionUpdate;
                editor.onCompositionUpdate = onCompositionUpdateOverride;
                editor.onCompositionStartOrig = editor.onCompositionStart;
                editor.onCompositionStart = onCompositionStartOverride;
            }
        } else {
            if (editor.onCompositionUpdateOrig) {
                editor.onCompositionUpdate = editor.onCompositionUpdateOrig;
                editor.onCompositionUpdateOrig = null;
                editor.onCompositionStart = editor.onCompositionStartOrig;
                editor.onCompositionStartOrig = null;
            }
        }
    },

    handleKeyboard: function(data, hashId, key, keyCode, e) {
        // ignore command keys (shift, ctrl etc.)
        if (hashId !== 0 && (!key || keyCode == -1))
            return null;
        
        var editor = data.editor;
        var vimState = data.vimState || "start";
        
        if (hashId == 1)
            key = "ctrl-" + key;
        if (key == "ctrl-c") {
            if (!useragent.isMac && editor.getCopyText()) {
                editor.once("copy", function() {
                    if (vimState == "start")
                        coreCommands.stop.exec(editor);
                    else
                        editor.selection.clearSelection();
                });
                return {command: "null", passEvent: true};
            }
            return {command: coreCommands.stop};
        } else if ((key == "esc" && hashId === 0) || key == "ctrl-[") {
            return {command: coreCommands.stop};
        } else if (vimState == "start") {
            if (useragent.isMac && this.handleMacRepeat(data, hashId, key)) {
                hashId = -1;
                key = data.inputChar;
            }
            
            if (hashId == -1 || hashId == 1 || hashId === 0 && key.length > 1) {
                if (cmds.inputBuffer.idle && startCommands[key])
                    return startCommands[key];
                var isHandled = cmds.inputBuffer.push(editor, key);
                if (!isHandled && hashId !== -1)
                    return;
                return {command: "null", passEvent: !isHandled}; 
            } else if (key == "esc" && hashId === 0) {
                return {command: coreCommands.stop};
            }
            // if no modifier || shift: wait for input.
            else if (hashId === 0 || hashId == 4) {
                return {command: "null", passEvent: true};
            } 
        } else {
            if (key == "ctrl-w") {
                return {command: "removewordleft"};
            }
        }
    },

    attach: function(editor) {
        editor.on("click", exports.onCursorMove);
        if (util.currentMode !== "insert")
            cmds.coreCommands.stop.exec(editor);
        editor.$vimModeHandler = this;
        
        this.updateMacCompositionHandlers(editor, true);
    },

    detach: function(editor) {
        editor.removeListener("click", exports.onCursorMove);
        util.noMode(editor);
        util.currentMode = "normal";
        this.updateMacCompositionHandlers(editor, false);
    },

    actions: cmds.actions,
    getStatusText: function() {
        if (util.currentMode == "insert")
            return "INSERT";
        if (util.onVisualMode)
            return (util.onVisualLineMode ? "VISUAL LINE " : "VISUAL ") + cmds.inputBuffer.status;
        return cmds.inputBuffer.status;
    }
};


exports.onCursorMove = function(e) {
    cmds.onCursorMove(e.editor, e);
    exports.onCursorMove.scheduled = false;
};

});
