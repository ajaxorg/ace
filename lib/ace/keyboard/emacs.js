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
require("../incremental_search");
var iSearchCommandModule = require("../commands/incremental_search_commands");


var screenToTextBlockCoordinates = function(x, y) {
    var canvasPos = this.scroller.getBoundingClientRect();

    var col = Math.floor(
        (x + this.scrollLeft - canvasPos.left - this.$padding) / this.characterWidth
    );
    var row = Math.floor(
        (y + this.scrollTop - canvasPos.top) / this.lineHeight
    );

    return this.session.screenToDocumentPosition(row, col);
};

var HashHandler = require("./hash_handler").HashHandler;
exports.handler = new HashHandler();

exports.handler.isEmacs = true

var initialized = false;
var $formerLongWords;
var $formerLineStart;

exports.handler.attach = function(editor) {
    if (!initialized) {
        initialized = true;
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
    // in emacs, gotowordleft/right should not count a space as a word..
    $formerLongWords = editor.session.$selectLongWords;
    editor.session.$selectLongWords = true;
    // CTRL-A should go to actual beginning of line
    $formerLineStart = editor.session.$useEmacsStyleLineStart;
    editor.session.$useEmacsStyleLineStart = true;

    editor.session.$emacsMark = null;

    editor.emacsMarkMode = function() {
        return this.session.$emacsMark;
    }

    editor.setEmacsMarkMode = function(p) {
        this.session.$emacsMark = p;
    }

    editor.on("click", $resetMarkMode);
    editor.on("changeSession", $kbSessionChange);
    editor.renderer.screenToTextCoordinates = screenToTextBlockCoordinates;
    editor.setStyle("emacs-mode");
    editor.commands.addCommands(commands);
    exports.handler.platform = editor.commands.platform;
    editor.$emacsModeHandler = this;
};

exports.handler.detach = function(editor) {
    delete editor.renderer.screenToTextCoordinates;
    editor.session.$selectLongWords = $formerLongWords;
    editor.session.$useEmacsStyleLineStart = $formerLineStart;
    editor.removeEventListener("click", $resetMarkMode);
    editor.removeEventListener("changeSession", $kbSessionChange);
    editor.unsetStyle("emacs-mode");
    editor.commands.removeCommands(commands);
};

var $kbSessionChange = function(e) {
    if (e.oldSession) {
        e.oldSession.$selectLongWords = $formerLongWords;
        e.oldSession.$useEmacsStyleLineStart = $formerLineStart;
    }

    $formerLongWords = e.session.$selectLongWords;
    e.session.$selectLongWords = true;
    $formerLineStart = e.session.$useEmacsStyleLineStart;
    e.session.$useEmacsStyleLineStart = true;

    if (!e.session.hasOwnProperty('$emacsMark'))
        e.session.$emacsMark = null;
}

var $resetMarkMode = function(e) {
    e.editor.session.$emacsMark = null;
}

var keys = require("../lib/keys").KEY_MODS,
    eMods = {C: "ctrl", S: "shift", M: "alt", CMD: "command"},
    combinations = ["C-S-M-CMD",
                    "S-M-CMD", "C-M-CMD", "C-S-CMD", "C-S-M",
                    "M-CMD", "S-CMD", "S-M", "C-CMD", "C-M", "C-S",
                    "CMD", "M", "S", "C"];
combinations.forEach(function(c) {
    var hashId = 0;
    c.split("-").forEach(function(c) {
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
    var editor = data.editor;
    // insertstring data.count times
    if (hashId == -1) {
        editor.setEmacsMarkMode(null);
        if (data.count) {
            var str = Array(data.count + 1).join(key);
            data.count = null;
            return {command: "insertstring", args: str};
        }
    }

    if (key == "\x00") return undefined;

    var modifier = eMods[hashId];

    // CTRL + number / universalArgument for setting data.count
    if (modifier == "c-" || data.universalArgument) {
        var count = parseInt(key[key.length - 1]);
        if (count) {
            data.count = count;
            return {command: "null"};
        }
    }
    data.universalArgument = false;

    // this.commandKeyBinding maps key specs like "c-p" (for CTRL + P) to
    // command objects, for lookup key needs to include the modifier
    if (modifier) key = modifier + key;

    // Key combos like CTRL+X H build up the data.keyChain
    if (data.keyChain) key = data.keyChain += " " + key;

    // Key combo prefixes get stored as "null" (String!) in this
    // this.commmandKeyBinding. When encountered no command is invoked but we
    // buld up data.keyChain
    var command = this.commmandKeyBinding[key];
    data.keyChain = command == "null" ? key : "";

    // there really is no command
    if (!command) return undefined;

    // we pass b/c of key combo or universalArgument
    if (command === "null") return {command: "null"};

    if (command === "universalArgument") {
        data.universalArgument = true;
        return {command: "null"};
    }

    // lookup command
    // TODO extract special handling of markmode
    // TODO special case command.command is really unnecessary, remove
    var args;
    if (typeof command !== "string") {
        args = command.args;
        if (command.command) command = command.command;
        if (command === "goorselect") {
            command = editor.emacsMarkMode() ? args[1] : args[0];
            args = null;
        }
    }

    if (typeof command === "string") {
        if (command === "insertstring" ||
            command === "splitline" ||
            command === "togglecomment") {
            editor.setEmacsMarkMode(null);
        }
        command = this.commands[command] || editor.commands.commands[command];
        if (!command) return undefined;
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

    "C-s": "iSearch",
    "C-r": "iSearchBackwards",

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
    "C-x r":  "selectRectangularRegion",
    "M-x": {command: "focusCommandLine", args: "M-x "}
    // todo
    // "C-x C-t" "M-t" "M-c" "F11" "C-M- "M-q"
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
    setMark:  function(editor) {
        // Emulate emacs highlighting behaviour in transient-mark-mode.
        // Sets mark-mode and clears current selection.
        // When mark is set, keyboard cursor movement commands become
        // selection modification commands. That is,
        // "goto" commands become "select" commands.
        // Any insertion or mouse click resets mark-mode.
        // setMark twice in a row at the same place resets markmode
        var markMode = editor.emacsMarkMode();
        if (markMode) {
            var cp = editor.getCursorPosition();
            if (editor.selection.isEmpty() &&
                markMode.row == cp.row && markMode.column == cp.column) {
                editor.setEmacsMarkMode(null);
                // console.log("Mark mode off");
                return;
            }
        }
        // turn on mark mode
        markMode = editor.getCursorPosition();
        editor.setEmacsMarkMode(markMode);
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
        editor.setEmacsMarkMode(null);
        var pos = editor.getCursorPosition();
        if (pos.column == 0 &&
            editor.session.doc.getLine(pos.row).length == 0) {
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
    },
    keyboardQuit: function(editor) {
        editor.selection.clearSelection();
        editor.setEmacsMarkMode(null);
    },
    focusCommandLine: function(editor, arg) {
        if (editor.showCommandLine)
            editor.showCommandLine(arg);
    }
});

exports.handler.addCommands(iSearchCommandModule.iSearchStartCommands);

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
