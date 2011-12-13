/**
 * Vim mode for the Cloud9 IDE
 *
 * @author Sergi Mansilla <sergi AT c9 DOT io>
 * @copyright 2011, Ajax.org B.V.
 * @license GPLv3 <http://www.gnu.org/licenses/gpl.txt>
 */

define(function(require, exports, module) {

"use strict";

var Editors = require("ext/editors/editors");
var util = require("ext/vim/maps/util");
var motions = require("ext/vim/maps/motions");
var operators = require("ext/vim/maps/operators");
var alias = require("ext/vim/maps/aliases");
var registers = require("ext/vim/registers");

var NUMBER   = 1;
var OPERATOR = 2;
var MOTION   = 3;
var ACTION   = 4;

//var NORMAL_MODE = 0;
//var INSERT_MODE = 1;
//var VISUAL_MODE = 2;
//getSelectionLead

exports.searchStore = {
    current: "",
    options: {
        needle: "",
        backwards: false,
        wrap: true,
        caseSensitive: false,
        wholeWord: false,
        regExp: false
    }
};

var repeat = function repeat(fn, count, args) {
    count = parseInt(count);
    while (0 < count--)
        fn.apply(this, args);
};

var actions = {
    "z": {
        param: true,
        fn: function(editor, range, count, param) {
            switch (param) {
                case "z":
                    editor.centerSelection();
                    break;
                case "t":
                    editor.scrollToRow(editor.getCursorPosition().row);
                    break;
            }
        }
    },
    "r": {
        param: true,
        fn: function(editor, range, count, param) {
            param = util.toRealChar(param);
            if (param && param.length) {
                repeat(function() { editor.insert(param); }, count || 1);
                editor.navigateLeft();
            }
        }
    },
    // "~" HACK
    "shift-`": {
        fn: function(editor, range, count) {
            repeat(function() {
                var pos = editor.getCursorPosition();
                var line = editor.session.getLine(pos.row);
                var ch = line[pos.column];
                editor.insert(toggleCase(ch));
            }, count || 1);
        }
    },
    "*": {
        fn: function(editor, range, count, param) {
            editor.selection.selectWord();
            editor.findNext();
            var cursor = editor.selection.getCursor();
            var range  = editor.session.getWordRange(cursor.row, cursor.column);
            editor.selection.setSelectionRange(range, true);
        }
    },
    "#": {
        fn: function(editor, range, count, param) {
            editor.selection.selectWord();
            editor.findPrevious();
            var cursor = editor.selection.getCursor();
            var range  = editor.session.getWordRange(cursor.row, cursor.column);
            editor.selection.setSelectionRange(range, true);
        }
    },
    "n": {
        fn: function(editor, range, count, param) {
            editor.findNext(editor.getLastSearchOptions());
            editor.selection.clearSelection();
            //editor.navigateWordLeft();
        }
    },
    "shift-n": {
        fn: function(editor, range, count, param) {
            editor.findPrevious(editor.getLastSearchOptions());
            editor.selection.clearSelection();
            //editor.navigateWordLeft();
        }
    },
    "v": {
        fn: function(editor, range, count, param) {
            editor.selection.selectRight();
            util.onVisualMode = true;
            util.onVisualLineMode = false;
            var cursor = document.getElementsByClassName("ace_cursor")[0];
            cursor.style.display = "none";
        }
    },
    "shift-v": {
        fn: function(editor, range, count, param) {
            util.onVisualLineMode = true;
            //editor.selection.selectLine();
            //editor.selection.selectLeft();
            var row = editor.getCursorPosition().row;
            editor.selection.clearSelection();
            editor.selection.moveCursorTo(row, 0);
            editor.selection.selectLineEnd();
            editor.selection.visualLineStart = row;
        }
    },
    "shift-y": {
        fn: function(editor, range, count, param) {
            util.copyLine(editor);
        }
    },
    "p": {
        fn: function(editor, range, count, param) {
            var defaultReg = registers._default;

            editor.setOverwrite(false);
            if (defaultReg.isLine) {
                var pos = editor.getCursorPosition();
                var lines = defaultReg.text.split("\n");
                editor.session.getDocument().insertLines(pos.row + 1, lines);
                editor.moveCursorTo(pos.row + 1, 0);
            }
            else {
                editor.navigateRight();
                editor.insert(defaultReg.text);
                editor.navigateLeft();
            }
            editor.setOverwrite(true);
            editor.selection.clearSelection();
        }
    },
    "shift-p": {
        fn: function(editor, range, count, param) {
            var defaultReg = registers._default;
            editor.setOverwrite(false);

            if (defaultReg.isLine) {
                var pos = editor.getCursorPosition();
                var lines = defaultReg.text.split("\n");
                editor.session.getDocument().insertLines(pos.row, lines);
                editor.moveCursorTo(pos.row, 0);
            }
            else {
                editor.insert(defaultReg.text);
            }
            editor.setOverwrite(true);
            editor.selection.clearSelection();
        }
    },
    "shift-j": {
        fn: function(editor, range, count, param) {
            var pos = editor.getCursorPosition();

            if (editor.session.getLength() === pos.row + 1)
                return;

            var nextLine = editor.session.getLine(pos.row + 1);
            var cleanLine = /^\s*(.*)$/.exec(nextLine)[1];

            editor.navigateDown();
            editor.removeLines();

            if (editor.session.getLength() > editor.getCursorPosition().row + 1)
                editor.navigateUp();

            editor.navigateLineEnd();
            editor.insert(" " + (cleanLine || ""));
            editor.moveCursorTo(pos.row, pos.column);

        }
    },
    "u": {
        fn: function(editor, range, count, param) {
            count = parseInt(count || 1, 10);
            for (var i = 0; i < count; i++) {
                editor.undo();
            }
            editor.selection.clearSelection();
        }
    },
    "ctrl-r": {
        fn: function(editor, range, count, param) {
            count = parseInt(count || 1, 10);
            for (var i = 0; i < count; i++) {
                editor.redo();
            }
            editor.selection.clearSelection();
        }
    },
    ":": {
        fn: function(editor, range, count, param) {
            editor.blur();
            txtConsoleInput.focus();
            txtConsoleInput.setValue(":");
        }
    },
    "/": {
        fn: function(editor, range, count, param) {
            editor.blur();
            txtConsoleInput.focus();
            txtConsoleInput.setValue("/");
        }
    },
    ".": {
        fn: function(editor, range, count, param) {
            var previous = inputBuffer.previous;
            util.onInsertReplaySequence = inputBuffer.lastInsertCommands;
            inputBuffer.exec(editor, previous.action, previous.param);
        }
    }
};

var inputBuffer = exports.inputBuffer = {
    accepting: [NUMBER, OPERATOR, MOTION, ACTION],
    currentCmd: null,
    //currentMode: 0,
    currentCount: "",

    // Types
    operator: null,
    motion: null,

    lastInsertCommands: [],

    push: function(editor, char, keyId) {
        if (char && char.length > 1) { // There is a modifier key
            if (!char[char.length - 1].match(/[A-za-z]/) && keyId) // It is a letter
                char = keyId;
        }

        this.idle = false;
        var wObj = this.waitingForParam;
        if (wObj) {
            this.exec(editor, wObj, char);
        }
        // If input is a number (that doesn't start with 0)
        else if (!(char === "0" && !this.currentCount.length) &&
            (char.match(/^\d+$/) && this.isAccepting(NUMBER))) {
            // Assuming that char is always of type String, and not Number
            this.currentCount += char;
            this.currentCmd = NUMBER;
            this.accepting = [NUMBER, OPERATOR, MOTION, ACTION];
        }
        else if (!this.operator && this.isAccepting(OPERATOR) && operators[char]) {
            this.operator = {
                char: char,
                count: this.getCount()
            };
            this.currentCmd = OPERATOR;
            this.accepting = [NUMBER, MOTION, ACTION];
            this.exec(editor, { operator: this.operator });
        }
        else if (motions[char] && this.isAccepting(MOTION)) {
            this.currentCmd = MOTION;

            var ctx = {
                operator: this.operator,
                motion: {
                    char: char,
                    count: this.getCount()
                }
            };

            if (motions[char].param)
                this.waitForParam(ctx);
            else
                this.exec(editor, ctx);
        }
        else if (alias[char] && this.isAccepting(MOTION)) {
            alias[char].operator.count = this.getCount();
            this.exec(editor, alias[char]);
        }
        else if (actions[char] && this.isAccepting(ACTION)) {
            var actionObj = {
                action: {
                    fn: actions[char].fn,
                    count: this.getCount()
                }
            };

            if (actions[char].param) {
                this.waitForParam(actionObj);
            }
            else {
                this.exec(editor, actionObj);
            }
        }
        else if (this.operator) {
            this.exec(editor, { operator: this.operator }, char);
        }
        else {
            this.reset();
        }
    },

    waitForParam: function(cmd) {
        this.waitingForParam = cmd;
    },

    getCount: function() {
        var count = this.currentCount;
        this.currentCount = "";
        return count;
    },

    exec: function(editor, action, param) {
        var m = action.motion;
        var o = action.operator;
        var a = action.action;

        if(o) {
            this.previous = {
                action: action,
                param: param
            };
        }

        if (o && !editor.selection.isEmpty()) {
            if (operators[o.char].selFn) {
                operators[o.char].selFn(editor, editor.getSelectionRange(), o.count, param);
                this.reset();
            }
            return;
        }

        // There is an operator, but no motion or action. We try to pass the
        // current char to the operator to see if it responds to it (an example
        // of this is the 'dd' operator).
        else if (!m && !a && o && param) {
            operators[o.char].fn(editor, null, o.count, param);
            this.reset();
        }
        else if (m) {
            var run = function(fn) {
                if (fn && typeof fn === "function") { // There should always be a motion
                    if (m.count)
                        repeat(fn, m.count, [editor, null, m.count, param]);
                    else
                        fn(editor, null, m.count, param);
                }
            };

            var motionObj = motions[m.char];
            var selectable = motionObj.sel;

            if (!o) {
                if ((util.onVisualMode || util.onVisualLineMode) && selectable)
                    run(motionObj.sel);
                else
                    run(motionObj.nav);
            }
            else if (selectable) {
                repeat(function() {
                    run(motionObj.sel);
                    operators[o.char].fn(editor, editor.getSelectionRange(), o.count, param);
                }, o.count || 1);
            }
            this.reset();
        }
        else if (a) {
            a.fn(editor, editor.getSelectionRange(), a.count, param);
            this.reset();
        }
        handleCursorMove();
    },

    isAccepting: function(type) {
        return this.accepting.indexOf(type) !== -1;
    },

    reset: function() {
        this.operator = null;
        this.motion = null;
        this.currentCount = "";
        this.accepting = [NUMBER, OPERATOR, MOTION, ACTION];
        this.idle = true;
        this.waitingForParam = null;
    }
};

function setPreviousCommand(fn) {
    inputBuffer.previous = { action: { action: { fn: fn } } };
}

exports.commands = {
    start: {
        exec: function start(editor) {
            util.insertMode(editor);
            setPreviousCommand(start);
        }
    },
    startBeginning: {
        exec: function startBeginning(editor) {
            editor.navigateLineStart();
            util.insertMode(editor);
            setPreviousCommand(startBeginning);
        }
    },
    // Stop Insert mode as soon as possible. Works like typing <Esc> in
    // insert mode.
    stop: {
        exec: function stop(editor) {
            inputBuffer.reset();
            util.onVisualMode = false;
            util.onVisualLineMode = false;
            inputBuffer.lastInsertCommands = util.normalMode(editor);
        }
    },
    append: {
        exec: function append(editor) {
            var pos = editor.getCursorPosition();
            var lineLen = editor.session.getLine(pos.row).length;
            if (lineLen)
                editor.navigateRight();
            util.insertMode(editor);
            setPreviousCommand(append);
        }
    },
    appendEnd: {
        exec: function appendEnd(editor) {
            editor.navigateLineEnd();
            util.insertMode(editor);
            setPreviousCommand(appendEnd);
        }
    }
};

var handleCursorMove = exports.onCursorMove = function() {
    var editor = Editors.currentEditor.amlEditor.$editor;

    if(util.currentMode === 'insert' || handleCursorMove.running)
        return;
    else if(!editor.selection.isEmpty()) {
        handleCursorMove.running = true;
        if(util.onVisualLineMode) {
            var originRow = editor.selection.visualLineStart;
            var cursorRow = editor.getCursorPosition().row;
            if(originRow <= cursorRow) {
                var endLine = editor.session.getLine(cursorRow);
                editor.selection.clearSelection();
                editor.selection.moveCursorTo(originRow, 0);
                editor.selection.selectTo(cursorRow, endLine.length);
            } else {
                var endLine = editor.session.getLine(originRow);
                editor.selection.clearSelection();
                editor.selection.moveCursorTo(originRow, endLine.length);
                editor.selection.selectTo(cursorRow, 0);
            }
        }
        handleCursorMove.running = false;
        return;
    }
    else {
        handleCursorMove.running = true;
        var pos = editor.getCursorPosition();
        var lineLen = editor.session.getLine(pos.row).length;

        if (lineLen && pos.column === lineLen)
            editor.navigateLeft();
        handleCursorMove.running = false;
    }
};

function toggleCase(ch) {
    if(ch.toUpperCase() === ch)
        return ch.toLowerCase();
    else
        return ch.toUpperCase();
}

});