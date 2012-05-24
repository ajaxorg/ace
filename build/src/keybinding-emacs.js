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
 *   Julian Viereck (julian.viereck@gmail.com)
 *   Harutyun Amirjanyan (harutyun@c9.io)
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

define('ace/keyboard/emacs', ['require', 'exports', 'module' , 'ace/lib/dom', 'ace/keyboard/hash_handler', 'ace/lib/keys'], function(require, exports, module) {


var dom = require("../lib/dom");

var screenToTextBlockCoordinates = function(pageX, pageY) {
    var canvasPos = this.scroller.getBoundingClientRect();

    var col = Math.floor(
        (pageX + this.scrollLeft - canvasPos.left - this.$padding - dom.getPageScrollLeft()) / this.characterWidth
    );
    var row = Math.floor(
        (pageY + this.scrollTop - canvasPos.top - dom.getPageScrollTop()) / this.lineHeight
    );

    return this.session.screenToDocumentPosition(row, col);
};

var HashHandler = require("./hash_handler").HashHandler;
exports.handler = new HashHandler();

var initialized = false;
exports.handler.attach = function(editor) {
    if (!initialized) {
        initialized = true;
        dom.importCssString('\
            .emacs-mode .ace_cursor{\
                border: 2px rgba(50,250,50,0.8) solid!important;\
                -moz-box-sizing: border-box!important;\
                box-sizing: border-box!important;\
                background-color: rgba(0,250,0,0.9);\
                opacity: 0.5;\
            }\
            .emacs-mode .ace_cursor.ace_hidden{\
                opacity: 1;\
                background-color: transparent;\
            }\
            .emacs-mode .ace_cursor.ace_overwrite {\
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

    editor.renderer.screenToTextCoordinates = screenToTextBlockCoordinates;
    editor.setStyle("emacs-mode");
};

exports.handler.detach = function(editor) {
    delete editor.renderer.screenToTextCoordinates;
    editor.unsetStyle("emacs-mode");
};


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
    }

    if (typeof command == "string") {
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
    "Up|C-p"      : "golineup",
    "Down|C-n"    : "golinedown",
    "Left|C-b"    : "gotoleft",
    "Right|C-f"   : "gotoright",
    "C-Left|M-b"  : "gotowordleft",
    "C-Right|M-f" : "gotowordright",
    "Home|C-a"    : "gotolinestart",
    "End|C-e"     : "gotolineend",
    "C-Home|S-M-,": "gotostart",
    "C-End|S-M-." : "gotoend",

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

    "C-l|M-s" : "centerselection",
    "M-g": "gotoline",
    "C-x C-p": "selectall",

    // todo fix these
    "C-Down": "gotopagedown",
    "C-Up": "gotopageup",
    "PageDown|C-v": "gotopagedown",
    "PageUp|M-v": "gotopageup",
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

    "M-u": "touppercase",
    "M-l": "tolowercase",
    "M-/": "autocomplete",
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
    selectRectangularRegion:  function(editor) {
        editor.multiSelect.toggleBlockSelection();
    },
    setMark:  function() {
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
        editor.selection.selectLine();
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
        editor.cut();
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
