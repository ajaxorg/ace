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

var dom = require("../lib/dom");

var HashHandler = require("./hash_handler").HashHandler;
exports.handler = new HashHandler();

var initialized = false;

// When mark is set, keyboard cursor movement commands become selection
// modification commands. This is a little different than emacs. In
// emacs, keyboard cursor movement always sets mark, but it does not
// highlight the region unless mark has been otherwise explicitly set
// and transient-mark-mode is on.
// In ACE, there is no concept of a region that is not highlighted,
// so we just work with highlighted area === region. It would probably be
// confusing to most users anyway if a cut command, say, were to delete an
// area that was not highlighted.
var markMode;

exports.handler.attach = function(editor) {
    if (!initialized) {
        initialized = true;

        // in emacs, gotowordleft/right should not count a space as a word..
        editor.session.$selectLongWords = true;
        dom.importCssString('\
            .emacs-mode .ace_cursor{\
                border: 2px rgba(50,250,50,0.8) solid!important;\
                -moz-box-sizing: border-box!important;\
                -webkit-box-sizing: border-box!important;\
                box-sizing: border-box!important;\
                background-color: rgba(0,250,0,0.9);\
                opacity: 0.5;\
            }\
            .emacs-mode .ace_cursor.ace_hidden{\
                opacity: 1;\
                background-color: transparent;\
            }\
            .emacs-mode .ace_overwrite-cursors .ace_cursor {\
                opacity: 1;\
                background-color: transparent;\
                border-width: 0 0 2px 2px !important;\
            }\
            .emacs-mode .ace_text-layer {\
                z-index: 4\
            }\
            .emacs-mode .ace_cursor-layer {\
                z-index: 2\
            }', 'emacsMode'
        );
    }
    markMode = false;

    editor.on("click",$resetMarkMode);

    editor.setStyle("emacs-mode");
};

exports.handler.detach = function(editor) {
    editor.unsetStyle("emacs-mode");
    editor.removeEventListener("click",$resetMarkMode);
};

var $resetMarkMode = function(e) {
    markMode = null;
}

var keys = require("../lib/keys").KEY_MODS;
var eMods = {
    C: "ctrl", S: "shift", M: "alt"
};
["S-C-M", "S-C", "S-M", "C-M", "S", "C", "M"].forEach(function(c) {
    var hashId = 0;
    c.split("-").forEach(function(c){
        hashId = hashId | keys[eMods[c]];
    });
    eMods[hashId] = c.toLowerCase() + "-";
});

exports.handler.bindKey = function(key, command) {
    if (!key)
        return;

    var ckb = this.commmandKeyBinding;
    key.split("|").forEach(function(keyPart) {
        keyPart = keyPart.toLowerCase();
        ckb[keyPart] = command;
        keyPart = keyPart.split(" ")[0];
        if (!ckb[keyPart])
            ckb[keyPart] = "null";
    }, this);
};


exports.handler.handleKeyboard = function(data, hashId, key, keyCode) {
    if (hashId == -1) {
        markMode = null;
        if (data.count) {
            var str = Array(data.count + 1).join(key);
            data.count = null;
            return {command: "insertstring", args: str};
        }
    }

    if (key == "\x00")
        return;

    var modifier = eMods[hashId];
    if (modifier == "c-" || data.universalArgument) {
        var count = parseInt(key[key.length - 1]);
        if (count) {
            data.count = count;
            return {command: "null"};
        }
    }
    data.universalArgument = false;

    if (modifier)
        key = modifier + key;

    if (data.keyChain)
        key = data.keyChain += " " + key;

    var command = this.commmandKeyBinding[key];
    data.keyChain = command == "null" ? key : "";

    if (!command)
        return;

    if (command == "null")
        return {command: "null"};

    if (command == "universalArgument") {
        data.universalArgument = true;
        return {command: "null"};
    }

    if (typeof command != "string") {
        var args = command.args;
        command = command.command;
        if (command == "goorselect") {
            command = args[0];
            if (markMode) {
                command = args[1];
            }
            args = null;
        }
    }

    if (typeof command == "string") {
        if (command == "insertstring" ||
           command == "splitline" ||
           command == "togglecomment") {
            markMode = null;
        }
        command = this.commands[command] || data.editor.commands.commands[command];
    }

    if (!command.readonly && !command.isYank)
        data.lastCommand = null;

    if (data.count) {
        var count = data.count;
        data.count = 0;
        return {
            args: args,
            command: {
                exec: function(editor, args) {
                    for (var i = 0; i < count; i++)
                        command.exec(editor, args);
                }
            }
        };
    }

    return {command: command, args: args};
};

exports.emacsKeys = {
    // movement
    "Up|C-p"      : {command: "goorselect", args: ["golineup","selectup"]},         
    "Down|C-n"    : {command: "goorselect", args: ["golinedown","selectdown"]},       
    "Left|C-b"    : {command: "goorselect", args: ["gotoleft","selectleft"]},
    "Right|C-f"   : {command: "goorselect", args: ["gotoright","selectright"]},
    "C-Left|M-b"  : {command: "goorselect", args: ["gotowordleft","selectwordleft"]}, 
    "C-Right|M-f" : {command: "goorselect", args: ["gotowordright","selectwordright"]},
    "Home|C-a"    : {command: "goorselect", args: ["gotolinestart","selecttolinestart"]},
    "End|C-e"     : {command: "goorselect", args: ["gotolineend","selecttolineend"]},
    "C-Home|S-M-,": {command: "goorselect", args: ["gotostart","selecttostart"]},
    "C-End|S-M-." : {command: "goorselect", args: ["gotoend","selecttoend"]},

    // selection
    "S-Up|S-C-p"      : "selectup",
    "S-Down|S-C-n"    : "selectdown",
    "S-Left|S-C-b"    : "selectleft",
    "S-Right|S-C-f"   : "selectright",
    "S-C-Left|S-M-b"  : "selectwordleft",
    "S-C-Right|S-M-f" : "selectwordright",
    "S-Home|S-C-a"    : "selecttolinestart",
    "S-End|S-C-e"     : "selecttolineend",
    "S-C-Home"        : "selecttostart",
    "S-C-End"         : "selecttoend",

    "C-l" : "recenterTopBottom",
    "M-s" : "centerselection",
    "M-g": "gotoline",
    "C-x C-p": "selectall",

    // todo fix these
    "C-Down": {command: "goorselect", args: ["gotopagedown","selectpagedown"]},
    "C-Up": {command: "goorselect", args: ["gotopageup","selectpageup"]},
    "PageDown|C-v": {command: "goorselect", args: ["gotopagedown","selectpagedown"]},
    "PageUp|M-v": {command: "goorselect", args: ["gotopageup","selectpageup"]},
    "S-C-Down": "selectpagedown",
    "S-C-Up": "selectpageup",
    "C-s": "findnext",
    "C-r": "findprevious",
    "M-C-s": "findnext",
    "M-C-r": "findprevious",
    "S-M-5": "replace",

    // basic editing
    "Backspace": "backspace",
    "Delete|C-d": "del",
    "Return|C-m": {command: "insertstring", args: "\n"}, // "newline"
    "C-o": "splitline",

    "M-d|C-Delete": {command: "killWord", args: "right"},
    "C-Backspace|M-Backspace|M-Delete": {command: "killWord", args: "left"},
    "C-k": "killLine",

    "C-y|S-Delete": "yank",
    "M-y": "yankRotate",
    "C-g": "keyboardQuit",

    "C-w": "killRegion",
    "M-w": "killRingSave",
    "C-Space": "setMark",
    "C-x C-x": "exchangePointAndMark",

    "C-t": "transposeletters",
    "M-u": "touppercase",    // Doesn't work
    "M-l": "tolowercase",
    "M-/": "autocomplete",   // Doesn't work
    "C-u": "universalArgument",  

    "M-;": "togglecomment",

    "C-/|C-x u|S-C--|C-z": "undo",
    "S-C-/|S-C-x u|C--|S-C-z": "redo", //infinite undo?
    // vertical editing
    "C-x r":  "selectRectangularRegion"

    // todo
    // "M-x" "C-x C-t" "M-t" "M-c" "F11" "C-M- "M-q"
};


exports.handler.bindKeys(exports.emacsKeys);

exports.handler.addCommands({
    recenterTopBottom: function(editor) {
        var renderer = editor.renderer;
        var pos = renderer.$cursorLayer.getPixelPosition();
        var h = renderer.$size.scrollerHeight - renderer.lineHeight;       
        var scrollTop = renderer.scrollTop;
        if (Math.abs(pos.top - scrollTop) < 2) {
            scrollTop = pos.top - h;
        } else if (Math.abs(pos.top - scrollTop - h * 0.5) < 2) {
            scrollTop = pos.top;
        } else {
            scrollTop = pos.top - h * 0.5;
        }
        editor.session.setScrollTop(scrollTop);
    },
    selectRectangularRegion:  function(editor) {
        editor.multiSelect.toggleBlockSelection();
    },
    setMark:  function() {
        // Sets mark-mode and clears current selection.
        // When in mark-mode, "goto" commands become "select" commands.
        // Any insertion or mouse click resets mark-mode.

        if (markMode) {

            cp = editor.getCursorPosition();
            if (editor.selection.isEmpty() &&
               markMode.row == cp.row && markMode.column == cp.column) {
                // setMark twice in a row at the same place
                // resets markmode
                markMode = null;
                console.log("Mark mode off");
                return;
            }
        }

        // turn on mark mode
        markMode = editor.getCursorPosition();
        editor.selection.setSelectionAnchor(markMode.row, markMode.column);
        
    },
    exchangePointAndMark: {
        exec: function(editor) {
            var range = editor.selection.getRange();

            editor.selection.setSelectionRange(range, !editor.selection.isBackwards());
        },
        readonly: true,
        multiselectAction: "forEach"
    },
    killWord: {
        exec: function(editor, dir) {
            editor.clearSelection();
            if (dir == "left")
                editor.selection.selectWordLeft();
            else
                editor.selection.selectWordRight();

            var range = editor.getSelectionRange();
            var text = editor.session.getTextRange(range);
            exports.killRing.add(text);

            editor.session.remove(range);
            editor.clearSelection();
        },
        multiselectAction: "forEach"
    },
    killLine: function(editor) {
        markMode = null;

        if (editor.getCursorPosition().column == 0 &&
           editor.selection.isEmpty) {
            // If an already empty line is killed, remove
            // the line entirely
            editor.selection.selectLine();
        } else {
            // otherwise just remove from the current cursor position
            // to the end (but don't delete the selection if it's before
            // the cursor)
            editor.clearSelection();
            editor.selection.selectLineEnd();

        }
        var range = editor.getSelectionRange();
        var text = editor.session.getTextRange(range);
        exports.killRing.add(text);

        editor.session.remove(range);
        editor.clearSelection();
    },
    yank: function(editor) {
        editor.onPaste(exports.killRing.get());
        editor.keyBinding.$data.lastCommand = "yank";
    },
    yankRotate: function(editor) {
        if (editor.keyBinding.$data.lastCommand != "yank")
            return;

        editor.undo();
        editor.onPaste(exports.killRing.rotate());
        editor.keyBinding.$data.lastCommand = "yank";
    },
    killRegion: function(editor) {
        exports.killRing.add(editor.getCopyText());
        editor.commands.byName.cut.exec(editor);
    },
    killRingSave: function(editor) {
        exports.killRing.add(editor.getCopyText());
    }
});

var commands = exports.handler.commands;
commands.yank.isYank = true;
commands.yankRotate.isYank = true;

exports.killRing = {
    $data: [],
    add: function(str) {
        str && this.$data.push(str);
        if (this.$data.length > 30)
            this.$data.shift();
    },
    get: function() {
        return this.$data[this.$data.length - 1] || "";
    },
    pop: function() {
        if (this.$data.length > 1)
            this.$data.pop();
        return this.get();
    },
    rotate: function() {
        this.$data.unshift(this.$data.pop());
        return this.get();
    }
};


});
